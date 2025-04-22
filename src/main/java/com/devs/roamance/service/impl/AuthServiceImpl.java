package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.auth.AuthRequestDto;
import com.devs.roamance.dto.request.auth.RefreshTokenRequestDto;
import com.devs.roamance.dto.response.auth.AuthResponseDto;
import com.devs.roamance.exception.WrongCredentialsException;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.security.JwtUtils;
import com.devs.roamance.service.AuthService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

  private final JwtUtils jwtUtils;
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;

  public AuthServiceImpl(
      JwtUtils jwtUtils,
      AuthenticationManager authenticationManager,
      UserRepository userRepository) {
    this.jwtUtils = jwtUtils;
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
  }

  @Override
  public AuthResponseDto login(AuthRequestDto requestDto) {

    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  requestDto.getEmail(), requestDto.getPassword()));

      Optional<User> userOptional = userRepository.findByEmail(requestDto.getEmail());
      if (userOptional.isPresent()) {
        User user = userOptional.get();
        Authentication authWithUserId =
            new UsernamePasswordAuthenticationToken(
                authentication.getPrincipal(),
                authentication.getCredentials(),
                authentication.getAuthorities());
        ((UsernamePasswordAuthenticationToken) authWithUserId).setDetails(user.getId().toString());

        SecurityContextHolder.getContext().setAuthentication(authWithUserId);

        String accessToken = jwtUtils.generateAccessToken(authWithUserId);
        String refreshToken = jwtUtils.generateRefreshToken(authWithUserId);

        return new AuthResponseDto(
            200, true, ResponseMessage.LOGIN_SUCCESS, accessToken, refreshToken);
      } else {
        throw new WrongCredentialsException(ResponseMessage.WRONG_CREDENTIALS);
      }

    } catch (Exception e) {
      throw new WrongCredentialsException(ResponseMessage.WRONG_CREDENTIALS);
    }
  }

  @Override
  public AuthResponseDto refreshToken(RefreshTokenRequestDto requestDto) {

    String token = requestDto.getRefreshToken();

    String tokenType = jwtUtils.getTokenType(token);

    if (!"refresh".equals(tokenType)) {

      throw new IllegalArgumentException(ResponseMessage.INVALID_TOKEN_TYPE);
    }

    jwtUtils.validateToken(token);

    String email = jwtUtils.getEmailFromToken(token);
    String userId = jwtUtils.getUserIdFromToken(token);

    List<GrantedAuthority> authorities = new ArrayList<>();

    Authentication authentication =
        new UsernamePasswordAuthenticationToken(email, null, authorities);
    ((UsernamePasswordAuthenticationToken) authentication).setDetails(userId);

    String newAccessToken = jwtUtils.generateAccessToken(authentication);
    String newRefreshToken = jwtUtils.generateRefreshToken(authentication);

    return new AuthResponseDto(
        200, true, ResponseMessage.TOKEN_REFRESH_SUCCESS, newAccessToken, newRefreshToken);
  }
}
