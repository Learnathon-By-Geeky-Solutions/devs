package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.user.UserCreateRequestDto;
import com.devs.roamance.dto.request.user.UserUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserDto;
import com.devs.roamance.dto.response.user.UserListResponseDto;
import com.devs.roamance.dto.response.user.UserResponseDto;
import com.devs.roamance.exception.UserAlreadyExistException;
import com.devs.roamance.exception.UserNotFoundException;
import com.devs.roamance.model.user.Role;
import com.devs.roamance.model.user.User;
import com.devs.roamance.model.user.UserInfo;
import com.devs.roamance.model.user.preference.UserPreferences;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.impl.UserServiceImpl;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock private UserRepository userRepository;

  @Mock private ModelMapper modelMapper;

  @Mock private PasswordEncoder passwordEncoder;

  private UserService userService;

  private User testUser;
  private UUID testUserId;
  private UserDto testUserDto;

  @BeforeEach
  void setUp() {
    userService = new UserServiceImpl(userRepository, modelMapper, passwordEncoder);

    // Setup test data
    testUserId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);
    testUser.setEmail("test@example.com");
    testUser.setName("Test User");
    testUser.setPassword("encodedPassword");

    // Setup bidirectional relationship as the impl does
    UserInfo userInfo = new UserInfo();
    testUser.setInfo(userInfo);
    userInfo.setUser(testUser);

    UserPreferences userPreferences = new UserPreferences();
    testUser.setPreferences(userPreferences);
    userPreferences.setUser(testUser);

    // Set roles
    testUser.setRoles(new HashSet<>(Collections.singleton(Role.USER)));

    testUserDto = new UserDto();
    testUserDto.setId(testUserId);
    testUserDto.setEmail("test@example.com");
    testUserDto.setName("Test User");
  }

  @Test
  void create_ShouldCreateNewUser() {
    // Arrange
    UserCreateRequestDto createRequestDto = new UserCreateRequestDto();
    createRequestDto.setEmail("new@example.com");
    createRequestDto.setPassword("password");
    createRequestDto.setName("New User");

    User newUser = new User();
    newUser.setEmail("new@example.com");
    newUser.setName("New User");
    newUser.setInfo(new UserInfo());
    newUser.setPreferences(new UserPreferences());

    when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
    when(modelMapper.map(createRequestDto, User.class)).thenReturn(newUser);
    when(userRepository.save(any(User.class))).thenReturn(testUser);
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(testUserDto);

    // Act
    UserResponseDto result = userService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(testUserDto, result.getData());
    assertEquals(201, result.getStatus());
    assertEquals(ResponseMessage.REGISTRATION_SUCCESS, result.getMessage());

    // Verify bidirectional relationships and roles were set
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(userCaptor.capture());
    verify(userRepository).flush();

    User capturedUser = userCaptor.getValue();
    assertTrue(capturedUser.getRoles().contains(Role.USER));
    assertSame(capturedUser, capturedUser.getInfo().getUser());
    assertSame(capturedUser, capturedUser.getPreferences().getUser());
  }

  @Test
  void create_WhenUserAlreadyExists_ShouldThrowException() {
    // Arrange
    UserCreateRequestDto createRequestDto = new UserCreateRequestDto();
    createRequestDto.setEmail("existing@example.com");
    createRequestDto.setPassword("password");

    User newUser = new User();
    newUser.setEmail("existing@example.com");
    newUser.setName("Existing User");
    newUser.setInfo(new UserInfo());
    newUser.setPreferences(new UserPreferences());

    when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
    when(modelMapper.map(createRequestDto, User.class)).thenReturn(newUser);
    when(userRepository.save(any(User.class))).thenThrow(DataIntegrityViolationException.class);

    // Act & Assert
    assertThrows(UserAlreadyExistException.class, () -> userService.create(createRequestDto));
  }

  @Test
  void getAll_ShouldReturnAllUsers() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "name";
    String sortDir = "asc";

    List<User> users = new ArrayList<>();
    users.add(testUser);
    Page<User> userPage = new PageImpl<>(users);

    when(userRepository.findAll(any(Pageable.class))).thenReturn(userPage);
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(testUserDto);

    // Act
    UserListResponseDto result = userService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    assertEquals(200, result.getStatus());
    assertEquals(ResponseMessage.USERS_FETCH_SUCCESS, result.getMessage());
  }

  @Test
  void get_ShouldReturnUserById() {
    // Arrange
    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(testUserDto);

    // Act
    UserResponseDto result = userService.get(testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(testUserDto, result.getData());
    assertEquals(200, result.getStatus());
    assertEquals(ResponseMessage.USER_FETCH_SUCCESS, result.getMessage());
  }

  @Test
  void get_WhenUserNotFound_ShouldThrowException() {
    // Arrange
    UUID nonExistentId = UUID.randomUUID();
    when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(UserNotFoundException.class, () -> userService.get(nonExistentId));
  }

  @Test
  void getByEmail_ShouldReturnUser() {
    // Arrange
    String email = "test@example.com";
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(testUserDto);

    // Act
    UserResponseDto result = userService.getByEmail(email);

    // Assert
    assertNotNull(result);
    assertEquals(testUserDto, result.getData());
    assertEquals(200, result.getStatus());
    assertEquals(ResponseMessage.USER_FETCH_SUCCESS, result.getMessage());
  }

  @Test
  void getByEmail_WhenUserNotFound_ShouldThrowException() {
    // Arrange
    String nonExistentEmail = "nonexistent@example.com";
    when(userRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(UserNotFoundException.class, () -> userService.getByEmail(nonExistentEmail));
  }

  @Test
  void search_ShouldReturnMatchingUsers() {
    // Arrange
    String query = "test";
    int pageNumber = 0;
    int pageSize = 10;

    List<User> users = new ArrayList<>();
    users.add(testUser);
    Page<User> userPage = new PageImpl<>(users);

    when(userRepository.searchUsers(eq(query), any(Pageable.class))).thenReturn(userPage);
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(testUserDto);

    // Act
    UserListResponseDto result = userService.search(query, pageNumber, pageSize);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    assertEquals(200, result.getStatus());
    assertEquals(ResponseMessage.USERS_FETCH_SUCCESS, result.getMessage());
  }

  @Test
  void update_ShouldUpdateUser() {
    // Arrange
    UserUpdateRequestDto updateRequestDto = new UserUpdateRequestDto();
    updateRequestDto.setName("Updated Name");
    updateRequestDto.setEmail("updated@example.com");
    updateRequestDto.setPassword("newPassword");

    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
    when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
    when(userRepository.save(testUser)).thenReturn(testUser);
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(testUserDto);

    // Act
    UserResponseDto result = userService.update(updateRequestDto, testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(testUserDto, result.getData());
    assertEquals(200, result.getStatus());
    assertEquals(ResponseMessage.USER_UPDATE_SUCCESS, result.getMessage());

    // Verify the user was updated correctly
    verify(userRepository).save(testUser);
    verify(userRepository).flush();

    assertEquals("Updated Name", testUser.getName());
    assertEquals("updated@example.com", testUser.getEmail());
    assertEquals("encodedNewPassword", testUser.getPassword());
  }

  @Test
  void update_WhenUserNotFound_ShouldThrowException() {
    // Arrange
    UserUpdateRequestDto updateRequestDto = new UserUpdateRequestDto();
    UUID nonExistentId = UUID.randomUUID();
    when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        UserNotFoundException.class, () -> userService.update(updateRequestDto, nonExistentId));
  }

  @Test
  void delete_ShouldDeleteUser() {
    // Arrange
    when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

    // Act
    BaseResponseDto result = userService.delete(testUserId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertEquals(ResponseMessage.USER_DELETE_SUCCESS, result.getMessage());
    verify(userRepository).delete(testUser);
  }

  @Test
  void delete_WhenUserNotFound_ShouldThrowException() {
    // Arrange
    UUID nonExistentId = UUID.randomUUID();
    when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(UserNotFoundException.class, () -> userService.delete(nonExistentId));
  }
}
