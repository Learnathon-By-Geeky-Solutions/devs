package com.devs.roamance.service;

import com.devs.roamance.dto.request.UserCreateRequestDto;
import com.devs.roamance.dto.request.UserUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.UserListResponseDto;
import com.devs.roamance.dto.response.UserResponseDto;

public interface UserService extends BaseService<BaseResponseDto, UserListResponseDto,
        UserResponseDto, UserCreateRequestDto, UserUpdateRequestDto, Long> {

    UserResponseDto getByEmail(String email);

    UserResponseDto getFromAuthHeader(String header);

    UserListResponseDto search(String query);
}
