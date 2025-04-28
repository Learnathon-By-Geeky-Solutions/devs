package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.devs.roamance.dto.request.user.UserPreferencesRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesDto;
import com.devs.roamance.dto.response.user.UserPreferencesListResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesResponseDto;
import com.devs.roamance.exception.ResourceAlreadyExistException;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.common.ActivityType;
import com.devs.roamance.model.user.Role;
import com.devs.roamance.model.user.User;
import com.devs.roamance.model.user.preference.AccommodationType;
import com.devs.roamance.model.user.preference.BudgetLevel;
import com.devs.roamance.model.user.preference.ClimatePreference;
import com.devs.roamance.model.user.preference.CuisineType;
import com.devs.roamance.model.user.preference.TravelStyle;
import com.devs.roamance.model.user.preference.UserPreferences;
import com.devs.roamance.repository.UserPreferencesRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.impl.UserPreferencesServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserPreferencesServiceTest {

  @Mock private UserPreferencesRepository userPreferencesRepository;

  @Mock private UserRepository userRepository;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private UserPreferencesServiceImpl userPreferencesService;

  private User testUser;
  private User adminUser;
  private UserPreferences testUserPreferences;
  private UUID testPreferencesId;
  private UUID testUserId;
  private UUID adminUserId;

  @BeforeEach
  void setUp() {
    userPreferencesService =
        new UserPreferencesServiceImpl(
            userPreferencesRepository, userRepository, modelMapper, userUtil);
    // Setting self-reference for transaction management
    ReflectionTestUtils.setField(userPreferencesService, "self", userPreferencesService);

    // Setup test data
    testUserId = UUID.randomUUID();
    adminUserId = UUID.randomUUID();
    testPreferencesId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);
    testUser.setRoles(Set.of(Role.USER));

    adminUser = new User();
    adminUser.setId(adminUserId);
    adminUser.setRoles(Set.of(Role.ADMIN));

    testUserPreferences = new UserPreferences();
    testUserPreferences.setId(testPreferencesId);
    testUserPreferences.setUser(testUser);
    testUserPreferences.setTravelStyle(TravelStyle.RELAXED);
    testUserPreferences.setClimatePreference(ClimatePreference.WARM_AND_SUNNY);
    testUserPreferences.setBudgetLevel(BudgetLevel.MODERATE);
    testUserPreferences.setActivityTypes(
        Set.of(ActivityType.SIGHTSEEING, ActivityType.CULTURAL_EXPERIENCE));
    testUserPreferences.setAccommodationTypes(
        Set.of(AccommodationType.HOTELS, AccommodationType.RESORTS));
    testUserPreferences.setCuisineTypes(Set.of(CuisineType.INTERNATIONAL, CuisineType.FINE_DINING));

    testUser.setPreferences(testUserPreferences);
  }

  @Test
  void create_ShouldCreateNewUserPreferences() {
    // Arrange
    UserPreferencesRequestDto createRequestDto = new UserPreferencesRequestDto();
    createRequestDto.setTravelStyle(TravelStyle.RELAXED);
    createRequestDto.setClimatePreference(ClimatePreference.WARM_AND_SUNNY);
    createRequestDto.setBudgetLevel(BudgetLevel.MODERATE);
    createRequestDto.setActivityTypes(
        Set.of(ActivityType.SIGHTSEEING, ActivityType.CULTURAL_EXPERIENCE));
    createRequestDto.setAccommodationTypes(
        Set.of(AccommodationType.HOTELS, AccommodationType.RESORTS));
    createRequestDto.setCuisineTypes(Set.of(CuisineType.INTERNATIONAL, CuisineType.FINE_DINING));

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.findByUserId(testUserId)).thenReturn(Optional.empty());
    when(userPreferencesRepository.save(any(UserPreferences.class)))
        .thenReturn(testUserPreferences);
    when(userRepository.save(any(User.class))).thenReturn(testUser);

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesResponseDto result = userPreferencesService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(userPreferencesDto, result.getData());
    verify(userPreferencesRepository, times(1)).save(any(UserPreferences.class));
    verify(userRepository, times(1)).save(any(User.class));
  }

  @Test
  void create_ShouldThrowException_WhenUserPreferencesAlreadyExist() {
    // Arrange
    UserPreferencesRequestDto createRequestDto = new UserPreferencesRequestDto();

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(Optional.of(testUserPreferences));

    // Act & Assert
    assertThrows(
        ResourceAlreadyExistException.class, () -> userPreferencesService.create(createRequestDto));
  }

  @Test
  void getAll_ShouldReturnAllUserPreferences_WhenUserIsAdmin() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "id";
    String sortDir = "asc";

    when(userUtil.getAuthenticatedUser()).thenReturn(adminUser);

    List<UserPreferences> userPreferencesList = new ArrayList<>();
    userPreferencesList.add(testUserPreferences);
    Page<UserPreferences> userPreferencesPage = new PageImpl<>(userPreferencesList);

    when(userPreferencesRepository.findAll(any(Pageable.class))).thenReturn(userPreferencesPage);

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesListResponseDto result =
        userPreferencesService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getData().size());
    verify(userPreferencesRepository, times(1)).findAll(any(Pageable.class));
  }

  @Test
  void getAll_ShouldReturnOnlyCurrentUserPreferences_WhenUserIsNotAdmin() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "id";
    String sortDir = "asc";

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(Optional.of(testUserPreferences));

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesListResponseDto result =
        userPreferencesService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getData().size());
    verify(userPreferencesRepository, times(0)).findAll(any(Pageable.class));
    verify(userPreferencesRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  void get_ShouldReturnUserPreferences() {
    // Arrange
    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesResponseDto result = userPreferencesService.get(testPreferencesId);

    // Assert
    assertNotNull(result);
    assertEquals(userPreferencesDto, result.getData());
    verify(userPreferencesRepository, times(1)).findById(testPreferencesId);
  }

  @Test
  void get_ShouldThrowException_WhenUserPreferencesNotFound() {
    // Arrange
    when(userPreferencesRepository.findById(testPreferencesId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class, () -> userPreferencesService.get(testPreferencesId));
  }

  @Test
  void get_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());
    differentUser.setRoles(Set.of(Role.USER));

    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedAccessException.class, () -> userPreferencesService.get(testPreferencesId));
  }

  @Test
  void getByUserId_ShouldReturnUserPreferences() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(Optional.of(testUserPreferences));

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesResponseDto result = userPreferencesService.getByUserId(testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(userPreferencesDto, result.getData());
    verify(userPreferencesRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  void getByUserId_ShouldReturnUserPreferences_WhenUserIsAdmin() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(adminUser);
    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(Optional.of(testUserPreferences));

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesResponseDto result = userPreferencesService.getByUserId(testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(userPreferencesDto, result.getData());
    verify(userPreferencesRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  void getByUserId_ShouldThrowException_WhenUserPreferencesNotFound() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.findByUserId(testUserId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class, () -> userPreferencesService.getByUserId(testUserId));
  }

  @Test
  void getByUserId_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());
    differentUser.setRoles(Set.of(Role.USER));

    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedAccessException.class, () -> userPreferencesService.getByUserId(testUserId));
  }

  @Test
  void update_ShouldUpdateUserPreferences() {
    // Arrange
    UserPreferencesRequestDto updateRequestDto = new UserPreferencesRequestDto();
    updateRequestDto.setTravelStyle(TravelStyle.ADVENTUROUS);
    updateRequestDto.setBudgetLevel(BudgetLevel.LUXURY);

    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.save(any(UserPreferences.class)))
        .thenReturn(testUserPreferences);

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesResponseDto result =
        userPreferencesService.update(updateRequestDto, testPreferencesId);

    // Assert
    assertNotNull(result);
    assertEquals(userPreferencesDto, result.getData());
    verify(userPreferencesRepository, times(1)).save(any(UserPreferences.class));
  }

  @Test
  void update_ShouldThrowException_WhenDataIntegrityViolationOccurs() {
    // Arrange
    UserPreferencesRequestDto updateRequestDto = new UserPreferencesRequestDto();
    updateRequestDto.setTravelStyle(TravelStyle.ADVENTUROUS);
    updateRequestDto.setBudgetLevel(BudgetLevel.LUXURY);

    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.save(any(UserPreferences.class)))
        .thenThrow(DataIntegrityViolationException.class);

    // Act & Assert
    Exception exception =
        assertThrows(
            Exception.class,
            () -> userPreferencesService.update(updateRequestDto, testPreferencesId));

    assertTrue(
        exception instanceof DataIntegrityViolationException
            || exception instanceof ResourceAlreadyExistException,
        "Exception should be either DataIntegrityViolationException or ResourceAlreadyExistException");
  }

  @Test
  void updateByUserId_ShouldUpdateUserPreferences() {
    // Arrange
    UserPreferencesRequestDto updateRequestDto = new UserPreferencesRequestDto();
    updateRequestDto.setTravelStyle(TravelStyle.ADVENTUROUS);
    updateRequestDto.setBudgetLevel(BudgetLevel.LUXURY);

    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userPreferencesRepository.save(any(UserPreferences.class)))
        .thenReturn(testUserPreferences);

    UserPreferencesDto userPreferencesDto = new UserPreferencesDto();
    when(modelMapper.map(testUserPreferences, UserPreferencesDto.class))
        .thenReturn(userPreferencesDto);

    // Act
    UserPreferencesResponseDto result =
        userPreferencesService.updateByUserId(updateRequestDto, testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(userPreferencesDto, result.getData());
    verify(userPreferencesRepository, times(1)).save(any(UserPreferences.class));
  }

  @Test
  void delete_ShouldDeleteUserPreferences() {
    // Arrange
    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userRepository.save(any(User.class))).thenReturn(testUser);

    // Act
    BaseResponseDto result = userPreferencesService.delete(testPreferencesId);

    // Assert
    assertNotNull(result);
    verify(userPreferencesRepository, times(1)).delete(testUserPreferences);
    verify(userRepository, times(1)).save(any(User.class));
  }

  @Test
  void delete_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());
    differentUser.setRoles(Set.of(Role.USER));

    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedAccessException.class, () -> userPreferencesService.delete(testPreferencesId));
  }

  @Test
  void deleteByUserId_ShouldDeleteUserPreferences() {
    // Arrange
    when(userPreferencesRepository.findByUserId(testUserId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userPreferencesRepository.findById(testPreferencesId))
        .thenReturn(Optional.of(testUserPreferences));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userRepository.save(any(User.class))).thenReturn(testUser);

    // Act
    BaseResponseDto result = userPreferencesService.deleteByUserId(testUserId);

    // Assert
    assertNotNull(result);
    verify(userPreferencesRepository, times(1)).delete(testUserPreferences);
    verify(userRepository, times(1)).save(any(User.class));
  }
}
