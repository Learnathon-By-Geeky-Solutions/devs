package com.devs.roamance.service;

import com.devs.roamance.dto.request.auth.AuthRequestDto;
import com.devs.roamance.dto.request.auth.RefreshTokenRequestDto;
import com.devs.roamance.dto.response.auth.AuthResponseDto;

public interface AuthService {

  AuthResponseDto login(AuthRequestDto requestDto);

  AuthResponseDto refreshToken(RefreshTokenRequestDto requestDto);
}
