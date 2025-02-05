package com.devs.roamance.controller;

import com.devs.roamance.dto.request.AuthRequestDto;
import com.devs.roamance.dto.request.RefreshTokenRequestDto;
import com.devs.roamance.dto.response.AuthResponseDto;
import com.devs.roamance.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto requestDto) {

        AuthResponseDto responseDto = authService.login(requestDto);

        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(@Valid @RequestBody RefreshTokenRequestDto requestDto) {

        AuthResponseDto responseDto = authService.refreshToken(requestDto);

        return ResponseEntity.ok(responseDto);
    }
}
