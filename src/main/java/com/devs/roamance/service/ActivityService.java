package com.devs.roamance.service;

import com.devs.roamance.dto.request.travel.itinerary.ActivityCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ActivityUpdateRequestDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityResponseDto;
import java.util.UUID;

public interface ActivityService
    extends BaseService<
        ActivityResponseDto,
        ActivityResponseDto,
        ActivityCreateRequestDto,
        ActivityUpdateRequestDto,
        UUID> {

  ActivityListResponseDto getByDayPlanId(
      UUID dayPlanId, int pageNumber, int pageSize, String sortBy, String sortDir);
}
