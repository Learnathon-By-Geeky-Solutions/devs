package com.devs.roamance.service;

import com.devs.roamance.dto.request.user.UserCreateRequestDto;
import com.devs.roamance.dto.request.user.UserUpdateRequestDto;
import com.devs.roamance.dto.response.user.UserListResponseDto;
import com.devs.roamance.dto.response.user.UserResponseDto;
import java.util.UUID;

public interface UserService
    extends BaseService<
        UserResponseDto, UserResponseDto, UserCreateRequestDto, UserUpdateRequestDto, UUID> {

  UserListResponseDto getAll(int pageNumber, int pageSize, String sortBy, String sortDir);

  UserResponseDto getByEmail(String email);

  UserListResponseDto search(String query, int page, int size);
}
