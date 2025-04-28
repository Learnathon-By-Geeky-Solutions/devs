package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.itinerary.DayPlanCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.DayPlanUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanBriefDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanDetailDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.DayPlanResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedActionException;
import com.devs.roamance.model.travel.itinerary.DayPlan;
import com.devs.roamance.model.travel.itinerary.Itinerary;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.DayPlanRepository;
import com.devs.roamance.repository.ItineraryRepository;
import com.devs.roamance.service.impl.DayPlanServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class DayPlanServiceTest {

  @Mock private DayPlanRepository dayPlanRepository;

  @Mock private ItineraryRepository itineraryRepository;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private DayPlanService dayPlanService;

  private User testUser;
  private Itinerary testItinerary;
  private DayPlan testDayPlan;
  private UUID testItineraryId;
  private UUID testDayPlanId;
  private UUID testUserId;

  @BeforeEach
  void setUp() {
    dayPlanService =
        new DayPlanServiceImpl(dayPlanRepository, itineraryRepository, userUtil, modelMapper);

    // Setup test data
    testUserId = UUID.randomUUID();
    testItineraryId = UUID.randomUUID();
    testDayPlanId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testItinerary = new Itinerary();
    testItinerary.setId(testItineraryId);
    testItinerary.setUser(testUser);

    testDayPlan = new DayPlan();
    testDayPlan.setId(testDayPlanId);
    testDayPlan.setItinerary(testItinerary);
    testDayPlan.setUser(testUser);
    testDayPlan.setDate(LocalDate.now());
  }

  @Test
  void create_ShouldCreateNewDayPlan() {
    // Arrange
    DayPlanCreateRequestDto createRequestDto = new DayPlanCreateRequestDto();
    createRequestDto.setItineraryId(testItineraryId);
    createRequestDto.setDate(LocalDate.now());

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(itineraryRepository.findByIdLite(testItineraryId)).thenReturn(Optional.of(testItinerary));
    when(modelMapper.map(createRequestDto, DayPlan.class)).thenReturn(testDayPlan);
    when(dayPlanRepository.save(any(DayPlan.class))).thenReturn(testDayPlan);

    DayPlanDetailDto dayPlanDetailDto = new DayPlanDetailDto();
    when(modelMapper.map(testDayPlan, DayPlanDetailDto.class)).thenReturn(dayPlanDetailDto);

    // Act
    DayPlanResponseDto result = dayPlanService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(dayPlanDetailDto, result.getData());
    verify(dayPlanRepository, times(1)).save(any(DayPlan.class));
    verify(dayPlanRepository, times(1)).flush();
  }

  @Test
  void get_ShouldReturnDayPlan() {
    // Arrange
    when(dayPlanRepository.findById(testDayPlanId)).thenReturn(Optional.of(testDayPlan));

    DayPlanDetailDto dayPlanDetailDto = new DayPlanDetailDto();
    when(modelMapper.map(testDayPlan, DayPlanDetailDto.class)).thenReturn(dayPlanDetailDto);

    // Act
    DayPlanResponseDto result = dayPlanService.get(testDayPlanId);

    // Assert
    assertNotNull(result);
    assertEquals(dayPlanDetailDto, result.getData());
    verify(dayPlanRepository, times(1)).findById(testDayPlanId);
  }

  @Test
  void get_ShouldThrowException_WhenDayPlanNotFound() {
    // Arrange
    when(dayPlanRepository.findById(testDayPlanId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> dayPlanService.get(testDayPlanId),
        String.format(ResponseMessage.DAY_PLAN_NOT_FOUND, testDayPlanId));
  }

  @Test
  void getByItineraryId_ShouldReturnDayPlans() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "date";
    String sortDir = "asc";

    List<DayPlan> dayPlans = new ArrayList<>();
    dayPlans.add(testDayPlan);
    Page<DayPlan> dayPlanPage = new PageImpl<>(dayPlans);

    when(dayPlanRepository.findAllByItineraryId(eq(testItineraryId), any(Pageable.class)))
        .thenReturn(dayPlanPage);

    DayPlanBriefDto dayPlanBriefDto = new DayPlanBriefDto();
    when(modelMapper.map(testDayPlan, DayPlanBriefDto.class)).thenReturn(dayPlanBriefDto);

    // Act
    DayPlanListResponseDto result =
        dayPlanService.getByItineraryId(testItineraryId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(dayPlanRepository, times(1))
        .findAllByItineraryId(eq(testItineraryId), any(Pageable.class));
  }

  @Test
  void update_ShouldUpdateDayPlan() {
    // Arrange
    DayPlanUpdateRequestDto updateRequestDto = new DayPlanUpdateRequestDto();
    updateRequestDto.setDate(LocalDate.now().plusDays(1));

    when(dayPlanRepository.findByIdWithItinerary(testDayPlanId))
        .thenReturn(Optional.of(testDayPlan));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(dayPlanRepository.save(any(DayPlan.class))).thenReturn(testDayPlan);

    DayPlanDetailDto dayPlanDetailDto = new DayPlanDetailDto();
    when(modelMapper.map(testDayPlan, DayPlanDetailDto.class)).thenReturn(dayPlanDetailDto);

    // Act
    DayPlanResponseDto result = dayPlanService.update(updateRequestDto, testDayPlanId);

    // Assert
    assertNotNull(result);
    assertEquals(dayPlanDetailDto, result.getData());
    verify(dayPlanRepository, times(1)).save(any(DayPlan.class));
    verify(dayPlanRepository, times(1)).flush();
  }

  @Test
  void update_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    DayPlanUpdateRequestDto updateRequestDto = new DayPlanUpdateRequestDto();

    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(dayPlanRepository.findByIdWithItinerary(testDayPlanId))
        .thenReturn(Optional.of(testDayPlan));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedActionException.class,
        () -> dayPlanService.update(updateRequestDto, testDayPlanId),
        ResponseMessage.DAY_PLAN_UPDATE_ACTION_DENIED);
  }

  @Test
  void delete_ShouldDeleteDayPlan() {
    // Arrange
    when(dayPlanRepository.findByIdLite(testDayPlanId)).thenReturn(Optional.of(testDayPlan));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    // Act
    BaseResponseDto result = dayPlanService.delete(testDayPlanId);

    // Assert
    assertNotNull(result);
    verify(dayPlanRepository, times(1)).delete(testDayPlan);
  }

  @Test
  void delete_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(dayPlanRepository.findByIdLite(testDayPlanId)).thenReturn(Optional.of(testDayPlan));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedActionException.class,
        () -> dayPlanService.delete(testDayPlanId),
        ResponseMessage.DAY_PLAN_DELETE_ACTION_DENIED);
  }
}
