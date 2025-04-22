package com.devs.roamance.controller;

import com.devs.roamance.dto.request.travel.itinerary.DayPlanCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.DayPlanUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanResponseDto;
import com.devs.roamance.service.DayPlanService;
import com.devs.roamance.util.PaginationSortingUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/travel/day-plans")
public class DayPlanController {

  private final DayPlanService dayPlanService;

  public DayPlanController(DayPlanService dayPlanService) {

    this.dayPlanService = dayPlanService;
  }

  @PostMapping
  public ResponseEntity<DayPlanResponseDto> createDayPlan(
      @Valid @RequestBody DayPlanCreateRequestDto requestDto) {

    DayPlanResponseDto responseDto = dayPlanService.create(requestDto);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/{dayPlanId}")
  public ResponseEntity<DayPlanResponseDto> getDayPlanById(@PathVariable @NotNull UUID dayPlanId) {

    DayPlanResponseDto responseDto = dayPlanService.get(dayPlanId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/itinerary/{itineraryId}")
  public ResponseEntity<DayPlanListResponseDto> getDayPlansByItineraryId(
      @PathVariable @NotNull UUID itineraryId,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(defaultValue = "date") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    DayPlanListResponseDto responseDto =
        dayPlanService.getByItineraryId(
            itineraryId, validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }

  @PutMapping("/{dayPlanId}")
  public ResponseEntity<DayPlanResponseDto> updateDayPlan(
      @PathVariable @NotNull UUID dayPlanId,
      @Valid @RequestBody DayPlanUpdateRequestDto requestDto) {

    DayPlanResponseDto responseDto = dayPlanService.update(requestDto, dayPlanId);

    return ResponseEntity.ok(responseDto);
  }

  @DeleteMapping("/{dayPlanId}")
  public ResponseEntity<BaseResponseDto> deleteDayPlan(@PathVariable @NotNull UUID dayPlanId) {

    BaseResponseDto responseDto = dayPlanService.delete(dayPlanId);

    return ResponseEntity.ok(responseDto);
  }
}
