package com.devs.roamance.service;

import com.devs.roamance.dto.request.user.UserInfoRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserInfoListResponseDto;
import com.devs.roamance.dto.response.user.UserInfoResponseDto;
import java.util.UUID;

public interface UserInfoService
    extends BaseService<
        UserInfoResponseDto, UserInfoResponseDto, UserInfoRequestDto, UserInfoRequestDto, UUID> {

  UserInfoListResponseDto getAll(int pageNumber, int pageSize, String sortBy, String sortDir);

  UserInfoResponseDto getByUserId(UUID id);

  UserInfoResponseDto updateByUserId(
      UserInfoRequestDto updateRequestDto, UUID userId); // Added request DTO parameter

  BaseResponseDto deleteByUserId(UUID id);
}
