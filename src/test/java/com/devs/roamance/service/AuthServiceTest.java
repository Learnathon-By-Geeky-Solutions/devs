package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.devs.roamance.dto.request.auth.AuthRequestDto;
import com.devs.roamance.dto.request.auth.RefreshTokenRequestDto;
import com.devs.roamance.dto.response.auth.AuthResponseDto;
import com.devs.roamance.exception.WrongCredentialsException;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.security.JwtUtils;
import com.devs.roamance.service.impl.AuthServiceImpl;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock private JwtUtils jwtUtils;

  @Mock private AuthenticationManager authenticationManager;

  @Mock private UserRepository userRepository;

  @Mock private SecurityContext securityContext;

  private AuthService authService;

  private User testUser;
  private String testEmail;
  private String testPassword;
  private UUID testUserId;

  @BeforeEach
  void setUp() {
    authService = new AuthServiceImpl(jwtUtils, authenticationManager, userRepository);

    // Setup test data
    testUserId = UUID.randomUUID();
    testEmail = "test@example.com";
    testPassword = "password123";

    testUser = new User();
    testUser.setId(testUserId);
    testUser.setEmail(testEmail);
    testUser.setPassword(testPassword);

    // Setup security context
    SecurityContextHolder.setContext(securityContext);
  }

  @AfterEach
  void tearDown() {
    // Clear security context after each test
    SecurityContextHolder.clearContext();
  }

  @Test
  void login_ShouldReturnTokens() {
    // Arrange
    AuthRequestDto requestDto = new AuthRequestDto();
    requestDto.setEmail(testEmail);
    requestDto.setPassword(testPassword);

    Authentication authentication =
        new UsernamePasswordAuthenticationToken(testEmail, testPassword);
    when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
    when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));

    String accessToken = "test.access.token";
    String refreshToken = "test.refresh.token";
    when(jwtUtils.generateAccessToken(any(Authentication.class))).thenReturn(accessToken);
    when(jwtUtils.generateRefreshToken(any(Authentication.class))).thenReturn(refreshToken);

    // Act
    AuthResponseDto result = authService.login(requestDto);

    // Assert
    assertNotNull(result);
    assertEquals(accessToken, result.getAccessToken());
    assertEquals(refreshToken, result.getRefreshToken());
    assertTrue(result.isSuccess());

    // Verify security context was updated with the new authentication
    ArgumentCaptor<Authentication> authCaptor = ArgumentCaptor.forClass(Authentication.class);
    verify(securityContext).setAuthentication(authCaptor.capture());
    Authentication capturedAuth = authCaptor.getValue();
    assertNotNull(capturedAuth);
    assertEquals(testEmail, ((UsernamePasswordAuthenticationToken) capturedAuth).getPrincipal());
  }

  @Test
  void login_ShouldThrowWrongCredentialsException() {
    // Arrange
    AuthRequestDto requestDto = new AuthRequestDto();
    requestDto.setEmail(testEmail);
    requestDto.setPassword(testPassword);

    Authentication authentication =
        new UsernamePasswordAuthenticationToken(testEmail, testPassword);
    when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
    when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(WrongCredentialsException.class, () -> authService.login(requestDto));
    // Verify security context wasn't updated
    verify(securityContext, never()).setAuthentication(any());
  }

  @Test
  void login_ShouldThrowWrongCredentialsException_WhenAuthenticationFails() {
    // Arrange
    AuthRequestDto requestDto = new AuthRequestDto();
    requestDto.setEmail(testEmail);
    requestDto.setPassword("wrong_password");

    when(authenticationManager.authenticate(any(Authentication.class)))
        .thenThrow(new WrongCredentialsException("Wrong credentials"));

    // Act & Assert
    assertThrows(WrongCredentialsException.class, () -> authService.login(requestDto));
    // Verify security context wasn't updated
    verify(securityContext, never()).setAuthentication(any());
  }

  @Test
  void refreshToken_ShouldReturnNewTokens() {
    // Arrange
    RefreshTokenRequestDto requestDto = new RefreshTokenRequestDto();
    String oldRefreshToken = "old.refresh.token";
    requestDto.setRefreshToken(oldRefreshToken);

    when(jwtUtils.getTokenType(oldRefreshToken)).thenReturn("refresh");
    when(jwtUtils.getEmailFromToken(oldRefreshToken)).thenReturn(testEmail);
    when(jwtUtils.getUserIdFromToken(oldRefreshToken)).thenReturn(testUserId.toString());

    String newAccessToken = "new.access.token";
    String newRefreshToken = "new.refresh.token";
    when(jwtUtils.generateAccessToken(any(Authentication.class))).thenReturn(newAccessToken);
    when(jwtUtils.generateRefreshToken(any(Authentication.class))).thenReturn(newRefreshToken);

    // Act
    AuthResponseDto result = authService.refreshToken(requestDto);

    // Assert
    assertNotNull(result);
    assertEquals(newAccessToken, result.getAccessToken());
    assertEquals(newRefreshToken, result.getRefreshToken());
    assertTrue(result.isSuccess());

    // Verify a new authentication was created with the user details from the token
    ArgumentCaptor<Authentication> authCaptor = ArgumentCaptor.forClass(Authentication.class);
    verify(jwtUtils).generateAccessToken(authCaptor.capture());
    Authentication capturedAuth = authCaptor.getValue();
    assertNotNull(capturedAuth);
    assertEquals(testEmail, capturedAuth.getPrincipal());
  }

  @Test
  void refreshToken_ShouldThrowIllegalArgumentException_WhenInvalidTokenType() {
    // Arrange
    RefreshTokenRequestDto requestDto = new RefreshTokenRequestDto();
    String invalidToken = "invalid.token.type";
    requestDto.setRefreshToken(invalidToken);

    when(jwtUtils.getTokenType(invalidToken)).thenReturn("access");

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> authService.refreshToken(requestDto));

    // Verify no token generation was attempted
    verify(jwtUtils, never()).generateAccessToken(any());
    verify(jwtUtils, never()).generateRefreshToken(any());
  }

  @Test
  void refreshToken_ShouldThrowIllegalArgumentException_WhenTokenIsNull() {
    // Arrange
    RefreshTokenRequestDto requestDto = new RefreshTokenRequestDto();
    requestDto.setRefreshToken(null);

    // The implementation calls getTokenType even when token is null
    when(jwtUtils.getTokenType(null))
        .thenThrow(new IllegalArgumentException("Token cannot be null"));

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> authService.refreshToken(requestDto));

    // Verify no token generation was attempted
    verify(jwtUtils, never()).validateToken(any());
    verify(jwtUtils, never()).generateAccessToken(any());
  }

  @Test
  void refreshToken_ShouldThrowIllegalArgumentException_WhenTokenValidationFails() {
    // Arrange
    RefreshTokenRequestDto requestDto = new RefreshTokenRequestDto();
    String expiredToken = "expired.refresh.token";
    requestDto.setRefreshToken(expiredToken);

    when(jwtUtils.getTokenType(expiredToken)).thenReturn("refresh");
    // Mock the validateToken method to throw an exception when called with an expired token
    doThrow(new IllegalArgumentException("Token expired"))
        .when(jwtUtils)
        .validateToken(expiredToken);

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> authService.refreshToken(requestDto));

    // Verify no token generation was attempted
    verify(jwtUtils, never()).generateAccessToken(any());
    verify(jwtUtils, never()).generateRefreshToken(any());
  }
}
