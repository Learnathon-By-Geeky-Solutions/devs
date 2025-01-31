package com.devs.roamance.service;

import com.devs.roamance.dto.request.UserRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.UserListResponseDto;
import com.devs.roamance.dto.response.UserResponseDto;

public interface UserService {

    UserListResponseDto getAllUsers();

    UserResponseDto getUserById(Long userId);

    UserResponseDto getUserByEmail(String email);

    UserListResponseDto searchUsers(String query);

    BaseResponseDto updateUser(UserRequestDto requestDto, Long userId);

    BaseResponseDto deleteUser(Long userId);
}
