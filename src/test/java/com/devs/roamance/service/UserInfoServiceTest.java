package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
import com.devs.roamance.service.impl.UserInfoServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserInfoServiceTest {

  @Mock private UserInfoRepository userInfoRepository;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private UserInfoServiceImpl userInfoService;

  private User testUser;
  private UserInfo testUserInfo;
  private UUID testUserInfoId;
  private UUID testUserId;

  @BeforeEach
  void setUp() {
    userInfoService = new UserInfoServiceImpl(userInfoRepository, userUtil, modelMapper);
    // Setting self-reference for transaction management
    ReflectionTestUtils.setField(userInfoService, "self", userInfoService);

    // Setup test data
    testUserId = UUID.randomUUID();
    testUserInfoId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testUserInfo = new UserInfo();
    testUserInfo.setId(testUserInfoId);
    testUserInfo.setUser(testUser);
    testUserInfo.setPhone("1234567890");
    testUserInfo.setBio("Test bio");
    testUserInfo.setLocation("Test location");
    testUserInfo.setBirthday(LocalDate.of(1990, 1, 1));
  }

  @Test
  void create_ShouldCreateNewUserInfo() {
    // Arrange
    UserInfoRequestDto createRequestDto = new UserInfoRequestDto();
    createRequestDto.setPhone("1234567890");
    createRequestDto.setBio("Test bio");
    createRequestDto.setLocation("Test location");
    createRequestDto.setBirthday(LocalDate.of(1990, 1, 1));

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.empty());
    when(userInfoRepository.save(any(UserInfo.class))).thenReturn(testUserInfo);

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoResponseDto result = userInfoService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(userInfoDto, result.getData());
    verify(userInfoRepository, times(1)).save(any(UserInfo.class));
  }

  @Test
  void create_ShouldThrowException_WhenUserInfoAlreadyExists() {
    // Arrange
    UserInfoRequestDto createRequestDto = new UserInfoRequestDto();

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.of(testUserInfo));

    // Act & Assert
    assertThrows(UserAlreadyExistException.class, () -> userInfoService.create(createRequestDto));
  }

  @Test
  void getAll_ShouldReturnAllUserInfos_WhenUserIsAdmin() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "asc";

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(true);

    List<UserInfo> userInfos = new ArrayList<>();
    userInfos.add(testUserInfo);
    Page<UserInfo> userInfoPage = new PageImpl<>(userInfos);

    when(userInfoRepository.findAll(any(Pageable.class))).thenReturn(userInfoPage);

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoListResponseDto result = userInfoService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getData().size());
    verify(userInfoRepository, times(1)).findAll(any(Pageable.class));
  }

  @Test
  void getAll_ShouldReturnOnlyCurrentUserInfo_WhenUserIsNotAdmin() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "asc";

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);
    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.of(testUserInfo));

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoListResponseDto result = userInfoService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(1, result.getData().size());
    verify(userInfoRepository, times(0)).findAll(any(Pageable.class));
    verify(userInfoRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  void get_ShouldReturnUserInfo() {
    // Arrange
    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.of(testUserInfo));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoResponseDto result = userInfoService.get(testUserInfoId);

    // Assert
    assertNotNull(result);
    assertEquals(userInfoDto, result.getData());
    verify(userInfoRepository, times(1)).findById(testUserInfoId);
  }

  @Test
  void get_ShouldThrowException_WhenUserInfoNotFound() {
    // Arrange
    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ResourceNotFoundException.class, () -> userInfoService.get(testUserInfoId));
  }

  @Test
  void get_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.of(testUserInfo));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);

    // Act & Assert
    assertThrows(UnauthorizedAccessException.class, () -> userInfoService.get(testUserInfoId));
  }

  @Test
  void getByUserId_ShouldReturnUserInfo() {
    // Arrange
    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.of(testUserInfo));

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoResponseDto result = userInfoService.getByUserId(testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(userInfoDto, result.getData());
    verify(userInfoRepository, times(1)).findByUserId(testUserId);
  }

  @Test
  void getByUserId_ShouldThrowException_WhenUserInfoNotFound() {
    // Arrange
    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ResourceNotFoundException.class, () -> userInfoService.getByUserId(testUserId));
  }

  @Test
  void update_ShouldUpdateUserInfo() {
    // Arrange
    UserInfoRequestDto updateRequestDto = new UserInfoRequestDto();
    updateRequestDto.setPhone("9876543210");
    updateRequestDto.setBio("Updated bio");

    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.of(testUserInfo));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);
    when(userInfoRepository.save(any(UserInfo.class))).thenReturn(testUserInfo);

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoResponseDto result = userInfoService.update(updateRequestDto, testUserInfoId);

    // Assert
    assertNotNull(result);
    assertEquals(userInfoDto, result.getData());
    verify(userInfoRepository, times(1)).save(any(UserInfo.class));
  }

  @Test
  void delete_ShouldDeleteUserInfo() {
    // Arrange
    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.of(testUserInfo));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);

    // Act
    BaseResponseDto result = userInfoService.delete(testUserInfoId);

    // Assert
    assertNotNull(result);
    verify(userInfoRepository, times(1)).delete(testUserInfo);
  }

  @Test
  void updateByUserId_ShouldUpdateUserInfo() {
    // Arrange
    UserInfoRequestDto updateRequestDto = new UserInfoRequestDto();
    updateRequestDto.setPhone("9876543210");
    updateRequestDto.setBio("Updated bio");

    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.of(testUserInfo));
    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.of(testUserInfo));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);
    when(userInfoRepository.save(any(UserInfo.class))).thenReturn(testUserInfo);

    UserInfoDto userInfoDto = new UserInfoDto();
    when(modelMapper.map(testUserInfo, UserInfoDto.class)).thenReturn(userInfoDto);

    // Act
    UserInfoResponseDto result = userInfoService.updateByUserId(updateRequestDto, testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(userInfoDto, result.getData());
    verify(userInfoRepository, times(1)).save(any(UserInfo.class));
  }

  @Test
  void deleteByUserId_ShouldDeleteUserInfo() {
    // Arrange
    when(userInfoRepository.findByUserId(testUserId)).thenReturn(Optional.of(testUserInfo));
    when(userInfoRepository.findById(testUserInfoId)).thenReturn(Optional.of(testUserInfo));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);

    // Act
    BaseResponseDto result = userInfoService.deleteByUserId(testUserId);

    // Assert
    assertNotNull(result);
    verify(userInfoRepository, times(1)).delete(testUserInfo);
  }
}
