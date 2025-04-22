package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.user.UserPreferencesRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesDto;
import com.devs.roamance.dto.response.user.UserPreferencesListResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesResponseDto;
import com.devs.roamance.exception.ResourceAlreadyExistException;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.user.User;
import com.devs.roamance.model.user.preference.BudgetLevel;
import com.devs.roamance.model.user.preference.ClimatePreference;
import com.devs.roamance.model.user.preference.TravelStyle;
import com.devs.roamance.model.user.preference.UserPreferences;
import com.devs.roamance.repository.UserPreferencesRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.UserPreferencesService;
import com.devs.roamance.util.UserUtil;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserPreferencesServiceImpl implements UserPreferencesService {

  private final UserPreferencesRepository userPreferencesRepository;
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;
  private final UserUtil userUtil;

  @Lazy private UserPreferencesService self;

  public UserPreferencesServiceImpl(
      UserPreferencesRepository userPreferencesRepository,
      UserRepository userRepository,
      ModelMapper modelMapper,
      UserUtil userUtil) {
    this.userPreferencesRepository = userPreferencesRepository;
    this.userRepository = userRepository;
    this.modelMapper = modelMapper;
    this.userUtil = userUtil;
    this.self = this;
  }

  @Override
  @Transactional
  public UserPreferencesResponseDto create(UserPreferencesRequestDto createRequestDto) {
    User currentUser = userUtil.getAuthenticatedUser();

    userPreferencesRepository
        .findByUserId(currentUser.getId())
        .ifPresent(
            existingPreferences -> {
              throw new ResourceAlreadyExistException(
                  "User's Preferences already exist. Use the update endpoint instead.");
            });

    UserPreferences preferences = new UserPreferences();
    preferences.setUser(currentUser);
    updateUserPreferencesProperties(preferences, createRequestDto);

    UserPreferences savedPreferences = userPreferencesRepository.save(preferences);

    currentUser.setPreferences(savedPreferences);
    userRepository.save(currentUser);

    UserPreferencesDto dto = mapToDto(savedPreferences);

    return new UserPreferencesResponseDto(
        201, true, ResponseMessage.USER_PREFERENCES_CREATE_SUCCESS, dto);
  }

  @Override
  public UserPreferencesListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {
    User currentUser = userUtil.getAuthenticatedUser();
    boolean isAdmin = isAdmin(currentUser);

    List<UserPreferences> preferences;
    Page<UserPreferences> preferencesPage;

    if (isAdmin) {
      Sort sort =
          sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
              ? Sort.by(sortBy).ascending()
              : Sort.by(sortBy).descending();

      Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
      preferencesPage = userPreferencesRepository.findAll(pageable);
      preferences = preferencesPage.getContent();
    } else {
      preferences =
          userPreferencesRepository
              .findByUserId(currentUser.getId())
              .map(List::of)
              .orElse(List.of());
    }

    List<UserPreferencesDto> preferencesDto = preferences.stream().map(this::mapToDto).toList();

    return new UserPreferencesListResponseDto(
        200, true, ResponseMessage.USER_PREFERENCES_FETCH_SUCCESS, preferencesDto);
  }

  @Override
  public UserPreferencesResponseDto get(UUID id) {
    UserPreferences preferences = findUserPreferencesByIdOrThrow(id);
    User currentUser = userUtil.getAuthenticatedUser();
    checkPermission(preferences, currentUser, ResponseMessage.USER_PREFERENCES_ACCESS_DENIED);

    UserPreferencesDto dto = mapToDto(preferences);
    return new UserPreferencesResponseDto(
        200, true, ResponseMessage.USER_PREFERENCES_FETCH_SUCCESS, dto);
  }

  @Override
  public UserPreferencesResponseDto getByUserId(UUID userId) {
    User currentUser = userUtil.getAuthenticatedUser();
    if (!currentUser.getId().equals(userId) && !isAdmin(currentUser)) {
      throw new UnauthorizedAccessException(ResponseMessage.USER_PREFERENCES_ACCESS_DENIED);
    }

    UserPreferences preferences = findUserPreferencesByUserIdOrThrow(userId);

    UserPreferencesDto dto = mapToDto(preferences);
    return new UserPreferencesResponseDto(
        200, true, ResponseMessage.USER_PREFERENCES_FETCH_SUCCESS, dto);
  }

  @Override
  @Transactional
  public UserPreferencesResponseDto update(UserPreferencesRequestDto updateRequestDto, UUID id) {
    UserPreferences preferences = findUserPreferencesByIdOrThrow(id);
    User currentUser = userUtil.getAuthenticatedUser();
    checkPermission(preferences, currentUser, ResponseMessage.USER_PREFERENCES_ACCESS_DENIED);

    updateUserPreferencesProperties(preferences, updateRequestDto);

    UserPreferences savedPreferences = userPreferencesRepository.save(preferences);
    UserPreferencesDto dto = mapToDto(savedPreferences);

    return new UserPreferencesResponseDto(
        200, true, ResponseMessage.USER_PREFERENCES_UPDATE_SUCCESS, dto);
  }

  @Override
  @Transactional
  public UserPreferencesResponseDto updateByUserId(
      UserPreferencesRequestDto updateRequestDto, UUID userId) {
    UserPreferences preferences = findUserPreferencesByUserIdOrThrow(userId);
    return self.update(updateRequestDto, preferences.getId());
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID id) {
    UserPreferences preferences = findUserPreferencesByIdOrThrow(id);
    User currentUser = userUtil.getAuthenticatedUser();
    checkPermission(preferences, currentUser, ResponseMessage.USER_PREFERENCES_ACCESS_DENIED);

    User user = preferences.getUser();
    user.setPreferences(null);
    userRepository.save(user);

    userPreferencesRepository.delete(preferences);

    return new BaseResponseDto(200, true, ResponseMessage.USER_PREFERENCES_DELETE_SUCCESS);
  }

  @Override
  @Transactional
  public BaseResponseDto deleteByUserId(UUID userId) {
    UserPreferences preferences = findUserPreferencesByUserIdOrThrow(userId);
    return self.delete(preferences.getId());
  }

  private void updateUserPreferencesProperties(
      UserPreferences preferences, UserPreferencesRequestDto requestDto) {
    if (requestDto.getTravelStyle() != null) {
      preferences.setTravelStyle(requestDto.getTravelStyle());
    } else if (preferences.getTravelStyle() == null) {
      preferences.setTravelStyle(TravelStyle.BALANCED);
    }

    if (requestDto.getAccommodationTypes() != null) {
      preferences.setAccommodationTypes(new HashSet<>(requestDto.getAccommodationTypes()));
    }

    if (requestDto.getActivityTypes() != null) {
      preferences.setActivityTypes(new HashSet<>(requestDto.getActivityTypes()));
    }

    if (requestDto.getCuisineTypes() != null) {
      preferences.setCuisineTypes(new HashSet<>(requestDto.getCuisineTypes()));
    }

    if (requestDto.getClimatePreference() != null) {
      preferences.setClimatePreference(requestDto.getClimatePreference());
    } else if (preferences.getClimatePreference() == null) {
      preferences.setClimatePreference(ClimatePreference.ANY_CLIMATE);
    }

    if (requestDto.getBudgetLevel() != null) {
      preferences.setBudgetLevel(requestDto.getBudgetLevel());
    } else if (preferences.getBudgetLevel() == null) {
      preferences.setBudgetLevel(BudgetLevel.MODERATE);
    }
  }

  private UserPreferencesDto mapToDto(UserPreferences preferences) {
    UserPreferencesDto dto = modelMapper.map(preferences, UserPreferencesDto.class);
    dto.setUserId(preferences.getUser().getId());
    return dto;
  }

  private UserPreferences findUserPreferencesByIdOrThrow(UUID id) {
    return userPreferencesRepository
        .findById(id)
        .orElseThrow(
            () ->
                new ResourceNotFoundException(
                    String.format(ResponseMessage.USER_PREFERENCES_NOT_FOUND, id)));
  }

  private UserPreferences findUserPreferencesByUserIdOrThrow(UUID userId) {
    return userPreferencesRepository
        .findByUserId(userId)
        .orElseThrow(
            () ->
                new ResourceNotFoundException(
                    String.format(ResponseMessage.USER_PREFERENCES_NOT_FOUND, userId)));
  }

  private boolean isAdmin(User user) {
    return user.getRoles().stream().anyMatch(r -> r.name().equals("ADMIN"));
  }

  private void checkPermission(UserPreferences preferences, User currentUser, String errorMessage) {
    if (!preferences.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
      throw new UnauthorizedAccessException(errorMessage);
    }
  }
}
