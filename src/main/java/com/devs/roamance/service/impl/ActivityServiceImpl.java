package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.itinerary.ActivityCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ActivityUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.*;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedActionException;
import com.devs.roamance.model.travel.Location;
import com.devs.roamance.model.travel.itinerary.Activity;
import com.devs.roamance.model.travel.itinerary.ActivityType;
import com.devs.roamance.model.travel.itinerary.DayPlan;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ActivityRepository;
import com.devs.roamance.repository.DayPlanRepository;
import com.devs.roamance.service.ActivityService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityServiceImpl implements ActivityService {

  private final ActivityRepository activityRepository;
  private final DayPlanRepository dayPlanRepository;
  private final UserUtil userUtil;
  private final ModelMapper modelMapper;

  public ActivityServiceImpl(
      ActivityRepository activityRepository,
      DayPlanRepository dayPlanRepository,
      UserUtil userUtil,
      ModelMapper modelMapper) {

    this.activityRepository = activityRepository;
    this.dayPlanRepository = dayPlanRepository;
    this.userUtil = userUtil;
    this.modelMapper = modelMapper;
  }

  @Override
  @Transactional
  public ActivityResponseDto create(ActivityCreateRequestDto createRequestDto) {

    User user = userUtil.getAuthenticatedUser();

    DayPlan dayPlan =
        dayPlanRepository
            .findByIdWithActivities(createRequestDto.getDayPlanId()) // with activities to avoid n+1
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(
                            ResponseMessage.ACTIVITY_NOT_FOUND, createRequestDto.getDayPlanId())));

    Activity activity = modelMapper.map(createRequestDto, Activity.class);

    // DayPlan was fetched with activities eagerly to avoid n+1 inside this validation method
    dayPlan.validateNoTimeCollisions(activity);

    activity.setDayPlan(dayPlan);
    activity.setUser(user);

    setActivityType(activity, createRequestDto.getType());

    Activity savedActivity = activityRepository.save(activity);
    activityRepository.flush();

    ActivityDto dto = modelMapper.map(savedActivity, ActivityDto.class);

    return new ActivityResponseDto(201, true, ResponseMessage.ACTIVITY_CREATE_SUCCESS, dto);
  }

  @Override
  public ActivityResponseDto get(UUID activityId) {

    Activity activity =
        activityRepository
            .findById(activityId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.ACTIVITY_NOT_FOUND, activityId)));

    ActivityDto dto = modelMapper.map(activity, ActivityDto.class);

    return new ActivityResponseDto(200, true, ResponseMessage.ACTIVITY_FETCH_SUCCESS, dto);
  }

  @Override
  public ActivityListResponseDto getByDayPlanId(
      UUID dayPlanId, int pageNumber, int pageSize, String sortBy, String sortDir) {

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Activity> activities = activityRepository.findAllByDayPlanId(dayPlanId, pageable);

    List<ActivityDto> dtos =
        activities.stream().map(activity -> modelMapper.map(activity, ActivityDto.class)).toList();

    return new ActivityListResponseDto(200, true, ResponseMessage.ACTIVITIES_FETCH_SUCCESS, dtos);
  }

  @Override
  @Transactional
  public ActivityResponseDto update(ActivityUpdateRequestDto updateRequestDto, UUID activityId) {

    Activity existingActivity =
        activityRepository
            .findByIdWithDayPlan(activityId) // fetched with DayPlan to avoid n+1 problem
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.ACTIVITY_NOT_FOUND, activityId)));

    UUID userId = userUtil.getAuthenticatedUser().getId();

    if (!existingActivity.getUser().getId().equals(userId)) {
      throw new UnauthorizedActionException(ResponseMessage.ACTIVITY_UPDATE_ACTION_DENIED);
    }

    if (updateRequestDto.getLocation() != null) {
      existingActivity.setLocation(modelMapper.map(updateRequestDto.getLocation(), Location.class));
    }
    if (updateRequestDto.getType() != null) {
      setActivityType(existingActivity, updateRequestDto.getType());
    }
    if (updateRequestDto.getNote() != null && !updateRequestDto.getNote().isEmpty()) {
      existingActivity.setNote(updateRequestDto.getNote());
    }
    if (updateRequestDto.getCost() != null) {
      existingActivity.setCost(updateRequestDto.getCost());
    }

    if (updateRequestDto.getStartTime() != null && updateRequestDto.getEndTime() != null) {

      existingActivity.setStartTime(updateRequestDto.getStartTime());
      existingActivity.setEndTime(updateRequestDto.getEndTime());

      // Activity was fetched with DayPlan & activities eagerly to avoid n+1 for this validation
      existingActivity.getDayPlan().validateNoTimeCollisions(existingActivity);

    } else if (updateRequestDto.getStartTime() != null) {

      existingActivity.setStartTime(updateRequestDto.getStartTime());

      existingActivity.getDayPlan().validateNoTimeCollisions(existingActivity);

    } else if (updateRequestDto.getEndTime() != null) {

      existingActivity.setEndTime(updateRequestDto.getEndTime());

      existingActivity.getDayPlan().validateNoTimeCollisions(existingActivity);
    }

    Activity savedActivity = activityRepository.save(existingActivity);
    activityRepository.flush();

    ActivityDto dto = modelMapper.map(savedActivity, ActivityDto.class);

    return new ActivityResponseDto(200, true, ResponseMessage.ACTIVITY_UPDATE_SUCCESS, dto);
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID activityId) {

    Activity activity =
        activityRepository
            .findById(activityId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.ACTIVITY_NOT_FOUND, activityId)));

    UUID userId = userUtil.getAuthenticatedUser().getId();

    if (!activity.getUser().getId().equals(userId)) {

      throw new UnauthorizedActionException(ResponseMessage.ACTIVITY_DELETE_ACTION_DENIED);
    }

    activityRepository.delete(activity);

    return new BaseResponseDto(200, true, ResponseMessage.ACTIVITY_DELETE_SUCCESS);
  }

  private void setActivityType(Activity activity, String inputType) {

    // Manually set ActivityType
    ActivityType activityType = ActivityType.fromString(inputType);
    activity.setType(activityType);

    // Set otherTypeName only for custom OTHER types
    String otherTypeName =
        (activityType == ActivityType.OTHER && inputType != null) ? inputType : null;

    activity.setOtherTypeName(otherTypeName);
  }
}
