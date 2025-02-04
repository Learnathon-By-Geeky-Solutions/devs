package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.AuthRequestDto;
import com.devs.roamance.dto.request.RefreshTokenRequestDto;
import com.devs.roamance.dto.response.AuthResponseDto;
import com.devs.roamance.exception.WrongCredentialsException;
import com.devs.roamance.security.JwtUtils;
import com.devs.roamance.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthServiceImpl(JwtUtils jwtUtils, AuthenticationManager authenticationManager) {

        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponseDto login(AuthRequestDto requestDto) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword()));

            String accessToken = jwtUtils.generateAccessToken(authentication);
            String refreshToken = jwtUtils.generateRefreshToken(authentication);

            return new AuthResponseDto(200, true, ResponseMessage.LOGIN_SUCCESS,
                    accessToken, refreshToken);

        } catch (Exception e) {

            throw new WrongCredentialsException(ResponseMessage.WRONG_CREDENTIALS);
        }
    }

    @Override
    public AuthResponseDto refreshToken(RefreshTokenRequestDto requestDto) {

        String refreshToken = requestDto.getRefreshToken();

        jwtUtils.validateToken(refreshToken);

        String email = jwtUtils.getEmailFromToken(refreshToken);

        List<GrantedAuthority> authorities = new ArrayList<>();

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);

        String newAccessToken = jwtUtils.generateAccessToken(authentication);
        String newRefreshToken = jwtUtils.generateRefreshToken(authentication);

        return new AuthResponseDto(200, true, ResponseMessage.TOKEN_REFRESH_SUCCESS,
                newAccessToken, newRefreshToken);
    }
}
