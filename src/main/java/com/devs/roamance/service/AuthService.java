package com.devs.roamance.service;

import com.devs.roamance.dto.request.AuthRequestDto;
import com.devs.roamance.dto.request.RefreshTokenRequestDto;
import com.devs.roamance.dto.response.AuthResponseDto;

public interface AuthService {

    AuthResponseDto login(AuthRequestDto requestDto);

    AuthResponseDto refreshToken(RefreshTokenRequestDto requestDto);
}