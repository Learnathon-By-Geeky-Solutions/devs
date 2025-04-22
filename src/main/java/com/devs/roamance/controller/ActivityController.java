package com.devs.roamance.controller;

import com.devs.roamance.dto.request.travel.itinerary.ActivityCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ActivityUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityResponseDto;
import com.devs.roamance.service.ActivityService;
import com.devs.roamance.util.PaginationSortingUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/travel/activities")
public class ActivityController {

  private final ActivityService activityService;

  public ActivityController(ActivityService activityService) {
    this.activityService = activityService;
  }

  @PostMapping
  public ResponseEntity<ActivityResponseDto> createActivity(
      @Valid @RequestBody ActivityCreateRequestDto requestDto) {

    ActivityResponseDto responseDto = activityService.create(requestDto);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/{activityId}")
  public ResponseEntity<ActivityResponseDto> getActivityById(
      @PathVariable @NotNull UUID activityId) {

    ActivityResponseDto responseDto = activityService.get(activityId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/day-plan/{dayPlanId}")
  public ResponseEntity<ActivityListResponseDto> getActivitiesByDayPlanId(
      @PathVariable @NotNull UUID dayPlanId,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "20") int pageSize,
      @RequestParam(defaultValue = "startTime") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    ActivityListResponseDto responseDto =
        activityService.getByDayPlanId(
            dayPlanId, validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }

  @PutMapping("/{activityId}")
  public ResponseEntity<ActivityResponseDto> updateActivity(
      @PathVariable @NotNull UUID activityId,
      @Valid @RequestBody ActivityUpdateRequestDto requestDto) {

    ActivityResponseDto responseDto = activityService.update(requestDto, activityId);

    return ResponseEntity.ok(responseDto);
  }

  @DeleteMapping("/{activityId}")
  public ResponseEntity<BaseResponseDto> deleteActivity(@PathVariable @NotNull UUID activityId) {

    BaseResponseDto responseDto = activityService.delete(activityId);

    return ResponseEntity.ok(responseDto);
  }
}
