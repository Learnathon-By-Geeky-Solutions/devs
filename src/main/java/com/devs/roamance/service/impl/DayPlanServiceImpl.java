package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.itinerary.DayPlanCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.DayPlanUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.*;
import com.devs.roamance.exception.ResourceAlreadyExistException;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedActionException;
import com.devs.roamance.model.travel.itinerary.DayPlan;
import com.devs.roamance.model.travel.itinerary.Itinerary;
import com.devs.roamance.model.travel.itinerary.RoutePlan;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.DayPlanRepository;
import com.devs.roamance.repository.ItineraryRepository;
import com.devs.roamance.service.DayPlanService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DayPlanServiceImpl implements DayPlanService {

  private final DayPlanRepository dayPlanRepository;
  private final ItineraryRepository itineraryRepository;
  private final UserUtil userUtil;
  private final ModelMapper modelMapper;

  public DayPlanServiceImpl(
      DayPlanRepository dayPlanRepository,
      ItineraryRepository itineraryRepository,
      UserUtil userUtil,
      ModelMapper modelMapper) {

    this.dayPlanRepository = dayPlanRepository;
    this.itineraryRepository = itineraryRepository;
    this.userUtil = userUtil;
    this.modelMapper = modelMapper;
  }

  @Override
  @Transactional
  public DayPlanResponseDto create(DayPlanCreateRequestDto createRequestDto) {

    User user = userUtil.getAuthenticatedUser();

    Itinerary itinerary =
        itineraryRepository
            .findByIdLite(createRequestDto.getItineraryId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(
                            ResponseMessage.ITINERARY_NOT_FOUND,
                            createRequestDto.getItineraryId())));

    DayPlan dayPlan = modelMapper.map(createRequestDto, DayPlan.class);

    itinerary.validateDayPlanDate(dayPlan);

    dayPlan.setItinerary(itinerary);
    dayPlan.setUser(user);

    try {
      DayPlan savedDayPlan = dayPlanRepository.save(dayPlan);
      dayPlanRepository.flush();

      DayPlanDetailDto dto = modelMapper.map(savedDayPlan, DayPlanDetailDto.class);

      return new DayPlanResponseDto(201, true, ResponseMessage.DAY_PLAN_CREATE_SUCCESS, dto);

    } catch (DataIntegrityViolationException e) {

      throw new ResourceAlreadyExistException(
          String.format(ResponseMessage.DAY_PLAN_ALREADY_EXIST, createRequestDto.getDate()));
    }
  }

  @Override
  public DayPlanResponseDto get(UUID dayPlanId) {

    DayPlan dayPlan =
        dayPlanRepository
            .findById(dayPlanId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.DAY_PLAN_NOT_FOUND, dayPlanId)));

    DayPlanDetailDto dto = modelMapper.map(dayPlan, DayPlanDetailDto.class);

    return new DayPlanResponseDto(200, true, ResponseMessage.DAY_PLAN_FETCH_SUCCESS, dto);
  }

  @Override
  public DayPlanListResponseDto getByItineraryId(
      UUID itineraryId, int pageNumber, int pageSize, String sortBy, String sortDir) {

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<DayPlan> dayPlans = dayPlanRepository.findAllByItineraryId(itineraryId, pageable);

    List<DayPlanBriefDto> dtos =
        dayPlans.stream().map(dayPlan -> modelMapper.map(dayPlan, DayPlanBriefDto.class)).toList();

    return new DayPlanListResponseDto(200, true, ResponseMessage.DAY_PLANS_FETCH_SUCCESS, dtos);
  }

  @Override
  @Transactional
  public DayPlanResponseDto update(DayPlanUpdateRequestDto updateRequestDto, UUID dayPlanId) {

    DayPlan existingDayPlan =
        dayPlanRepository
            .findByIdWithItinerary(dayPlanId) // to avoid n+1 problem later in this method
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.DAY_PLAN_NOT_FOUND, dayPlanId)));

    UUID userId = userUtil.getAuthenticatedUser().getId();

    if (!existingDayPlan.getUser().getId().equals(userId)) {
      throw new UnauthorizedActionException(ResponseMessage.DAY_PLAN_UPDATE_ACTION_DENIED);
    }

    if (updateRequestDto.getDate() != null) {
      existingDayPlan.setDate(updateRequestDto.getDate());

      // fetched with itinerary for this validation to avoid n+1 problem
      existingDayPlan.getItinerary().validateDayPlanDate(existingDayPlan);
    }
    if (updateRequestDto.getRoutePlan() != null) {
      existingDayPlan.setRoutePlan(
          modelMapper.map(updateRequestDto.getRoutePlan(), RoutePlan.class));
    }
    if (updateRequestDto.getNotes() != null && !updateRequestDto.getNotes().isEmpty()) {
      existingDayPlan.setNotes(updateRequestDto.getNotes());
    }

    try {
      DayPlan savedDayPlan = dayPlanRepository.save(existingDayPlan);
      dayPlanRepository.flush();

      DayPlanDetailDto dto = modelMapper.map(savedDayPlan, DayPlanDetailDto.class);

      return new DayPlanResponseDto(200, true, ResponseMessage.DAY_PLAN_UPDATE_SUCCESS, dto);

    } catch (DataIntegrityViolationException e) {

      throw new ResourceAlreadyExistException(
          String.format(ResponseMessage.DAY_PLAN_ALREADY_EXIST, updateRequestDto.getDate()));
    }
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID dayPlanId) {

    DayPlan dayPlan =
        dayPlanRepository
            .findByIdLite(dayPlanId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.DAY_PLAN_NOT_FOUND, dayPlanId)));

    UUID userId = userUtil.getAuthenticatedUser().getId();

    if (!dayPlan.getUser().getId().equals(userId)) {
      throw new UnauthorizedActionException(ResponseMessage.DAY_PLAN_DELETE_ACTION_DENIED);
    }

    dayPlanRepository.delete(dayPlan);

    return new BaseResponseDto(200, true, ResponseMessage.DAY_PLAN_DELETE_SUCCESS);
  }
}
