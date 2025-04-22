package com.devs.roamance.service;

import com.devs.roamance.dto.request.travel.itinerary.DayPlanCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.DayPlanUpdateRequestDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanResponseDto;
import java.util.UUID;

public interface DayPlanService
    extends BaseService<
        DayPlanResponseDto,
        DayPlanResponseDto,
        DayPlanCreateRequestDto,
        DayPlanUpdateRequestDto,
        UUID> {

  DayPlanListResponseDto getByItineraryId(
      UUID itineraryId, int pageNumber, int pageSize, String sortBy, String sortDir);
}
