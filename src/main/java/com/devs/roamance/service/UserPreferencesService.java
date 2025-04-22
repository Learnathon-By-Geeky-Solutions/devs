package com.devs.roamance.service;

import com.devs.roamance.dto.request.user.UserPreferencesRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesListResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesResponseDto;
import java.util.UUID;

public interface UserPreferencesService
    extends BaseService<
        UserPreferencesResponseDto,
        UserPreferencesResponseDto,
        UserPreferencesRequestDto,
        UserPreferencesRequestDto,
        UUID> {

  UserPreferencesListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir);

  UserPreferencesResponseDto getByUserId(UUID userId);

  UserPreferencesResponseDto updateByUserId(UserPreferencesRequestDto requestDto, UUID userId);

  BaseResponseDto deleteByUserId(UUID userId);
}
