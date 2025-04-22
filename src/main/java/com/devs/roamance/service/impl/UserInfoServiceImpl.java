package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.user.UserInfoRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserInfoDto;
import com.devs.roamance.dto.response.user.UserInfoListResponseDto;
import com.devs.roamance.dto.response.user.UserInfoResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.exception.UserAlreadyExistException;
import com.devs.roamance.model.user.User;
import com.devs.roamance.model.user.UserInfo;
import com.devs.roamance.repository.UserInfoRepository;
import com.devs.roamance.service.UserInfoService;
import com.devs.roamance.util.UserUtil;
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
public class UserInfoServiceImpl implements UserInfoService {

  private final UserInfoRepository userInfoRepository;
  private final UserUtil userUtil;
  private final ModelMapper modelMapper;

  @Lazy private UserInfoService self;

  public UserInfoServiceImpl(
      UserInfoRepository userInfoRepository, UserUtil userUtil, ModelMapper modelMapper) {
    this.userInfoRepository = userInfoRepository;
    this.userUtil = userUtil;
    this.modelMapper = modelMapper;
    this.self = this;
  }

  @Override
  @Transactional
  public UserInfoResponseDto create(UserInfoRequestDto createRequestDto) {
    User currentUser = userUtil.getAuthenticatedUser();

    userInfoRepository
        .findByUserId(currentUser.getId())
        .ifPresent(
            existingUserInfo -> {
              throw new UserAlreadyExistException(
                  "User's information already exist. Use the update endpoint instead.");
            });

    UserInfo userInfo = new UserInfo();
    userInfo.setUser(currentUser);
    updateUserInfoProperties(userInfo, createRequestDto);

    UserInfo savedUserInfo = userInfoRepository.save(userInfo);
    UserInfoDto dto = mapToDto(savedUserInfo);

    return new UserInfoResponseDto(201, true, ResponseMessage.USER_INFO_CREATE_SUCCESS, dto);
  }

  @Override
  public UserInfoListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {
    User currentUser = userUtil.getAuthenticatedUser();
    boolean isAdmin = userUtil.isAuthenticatedUserAdmin();

    List<UserInfo> info;
    Page<UserInfo> userInfoPage;

    if (isAdmin) {
      Sort sort =
          sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
              ? Sort.by(sortBy).ascending()
              : Sort.by(sortBy).descending();

      Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
      userInfoPage = userInfoRepository.findAll(pageable);
      info = userInfoPage.getContent();
    } else {
      info = userInfoRepository.findByUserId(currentUser.getId()).map(List::of).orElse(List.of());
    }

    List<UserInfoDto> userInfoDtos = info.stream().map(this::mapToDto).toList();

    return new UserInfoListResponseDto(
        200, true, ResponseMessage.USER_INFO_FETCH_SUCCESS, userInfoDtos);
  }

  @Override
  public UserInfoResponseDto get(UUID id) {
    UserInfo userInfo = findUserInfoById(id);

    UserInfoDto dto = mapToDto(userInfo);
    return new UserInfoResponseDto(200, true, ResponseMessage.USER_INFO_FETCH_SUCCESS, dto);
  }

  @Override
  public UserInfoResponseDto getByUserId(UUID id) {

    UserInfo userInfo = findUserInfoByUserId(id);
    UserInfoDto dto = mapToDto(userInfo);

    return new UserInfoResponseDto(200, true, ResponseMessage.USER_INFO_FETCH_SUCCESS, dto);
  }

  @Override
  @Transactional
  public UserInfoResponseDto update(UserInfoRequestDto updateRequestDto, UUID id) {
    UserInfo userInfo = findUserInfoById(id);

    updateUserInfoProperties(userInfo, updateRequestDto);

    UserInfo savedUserInfo = userInfoRepository.save(userInfo);
    UserInfoDto dto = mapToDto(savedUserInfo);

    return new UserInfoResponseDto(200, true, ResponseMessage.USER_INFO_UPDATE_SUCCESS, dto);
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID id) {
    UserInfo userInfo = findUserInfoById(id);

    userInfoRepository.delete(userInfo);
    return new BaseResponseDto(200, true, ResponseMessage.USER_INFO_DELETE_SUCCESS);
  }

  @Override
  @Transactional
  public UserInfoResponseDto updateByUserId(UserInfoRequestDto updateRequestDto, UUID userId) {
    UserInfo userInfo = findUserInfoByUserId(userId);
    return self.update(updateRequestDto, userInfo.getId());
  }

  @Override
  @Transactional
  public BaseResponseDto deleteByUserId(UUID userId) {
    UserInfo userInfo = findUserInfoByUserId(userId);
    return self.delete(userInfo.getId());
  }

  private void updateUserInfoProperties(UserInfo userInfo, UserInfoRequestDto requestDto) {
    userInfo.setPhone(requestDto.getPhone());
    userInfo.setBio(requestDto.getBio());
    userInfo.setLocation(requestDto.getLocation());
    userInfo.setBirthday(requestDto.getBirthday());
    userInfo.setCoverImage(requestDto.getCoverImage());
  }

  private UserInfoDto mapToDto(UserInfo userInfo) {
    UserInfoDto dto = modelMapper.map(userInfo, UserInfoDto.class);
    dto.setUserId(userInfo.getUser().getId());
    return dto;
  }

  private UserInfo findUserInfoById(UUID id) {
    UserInfo userInfo =
        userInfoRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format("No user's information found with id: %s", id)));

    User currentUser = userUtil.getAuthenticatedUser();
    if (!userInfo.getUser().getId().equals(currentUser.getId())
        && !userUtil.isAuthenticatedUserAdmin()) {
      throw new UnauthorizedAccessException(
          "You don't have permission to access this user's information");
    }
    return userInfo;
  }

  private UserInfo findUserInfoByUserId(UUID userId) {
    return userInfoRepository
        .findByUserId(userId)
        .orElseThrow(
            () ->
                new ResourceNotFoundException(
                    String.format("No user's information found for user with id: %s", userId)));
  }
}
