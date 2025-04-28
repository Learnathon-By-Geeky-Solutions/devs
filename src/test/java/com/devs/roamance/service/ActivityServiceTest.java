package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.devs.roamance.dto.request.travel.itinerary.ActivityCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ActivityUpdateRequestDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ActivityResponseDto;
import com.devs.roamance.model.travel.itinerary.Activity;
import com.devs.roamance.model.travel.itinerary.DayPlan;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ActivityRepository;
import com.devs.roamance.repository.DayPlanRepository;
import com.devs.roamance.service.impl.ActivityServiceImpl;
import com.devs.roamance.util.ActivityUtil;
import com.devs.roamance.util.UserUtil;
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
class ActivityServiceTest {

  @Mock private ActivityRepository activityRepository;

  @Mock private DayPlanRepository dayPlanRepository;

  @Mock private ActivityUtil activityUtil;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private ActivityService activityService;

  private User testUser;
  private DayPlan testDayPlan;
  private Activity testActivity;
  private UUID testDayPlanId;
  private UUID testActivityId;

  @BeforeEach
  void setUp() {
    activityService =
        new ActivityServiceImpl(
            activityRepository, dayPlanRepository, activityUtil, userUtil, modelMapper);

    // Setup test data
    UUID testUserId = UUID.randomUUID();
    testDayPlanId = UUID.randomUUID();
    testActivityId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testDayPlan = new DayPlan();
    testDayPlan.setId(testDayPlanId);
    testDayPlan.setUser(testUser);

    testActivity = new Activity();
    testActivity.setId(testActivityId);
    testActivity.setUser(testUser);
    testActivity.setDayPlan(testDayPlan);
  }

  @Test
  void create_ShouldCreateNewActivity() {
    // Arrange
    ActivityCreateRequestDto createRequestDto = new ActivityCreateRequestDto();
    createRequestDto.setDayPlanId(testDayPlanId);

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(dayPlanRepository.findByIdWithActivities(testDayPlanId))
        .thenReturn(Optional.of(testDayPlan));
    when(modelMapper.map(createRequestDto, Activity.class)).thenReturn(testActivity);
    when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

    ActivityDto activityDto = new ActivityDto();
    when(modelMapper.map(testActivity, ActivityDto.class)).thenReturn(activityDto);

    // Act
    ActivityResponseDto result = activityService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(activityDto, result.getData());
    verify(activityRepository, times(1)).save(any(Activity.class));
    verify(activityRepository, times(1)).flush();
  }

  @Test
  void get_ShouldReturnActivity() {
    // Arrange
    when(activityRepository.findById(testActivityId)).thenReturn(Optional.of(testActivity));

    // Create ActivityDto for the result instead of directly returning ActivityResponseDto
    ActivityDto activityDto = new ActivityDto();
    when(modelMapper.map(testActivity, ActivityDto.class)).thenReturn(activityDto);

    // Act
    ActivityResponseDto result = activityService.get(testActivityId);

    // Assert
    assertNotNull(result);
    assertEquals(activityDto, result.getData());
    verify(activityRepository, times(1)).findById(testActivityId);
  }

  @Test
  void getByDayPlanId_ShouldReturnActivityList() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "startTime";
    String sortDir = "asc";

    List<Activity> activities = new ArrayList<>();
    activities.add(testActivity);
    Page<Activity> activityPage = new PageImpl<>(activities);

    when(activityRepository.findAllByDayPlanId(eq(testDayPlanId), any(Pageable.class)))
        .thenReturn(activityPage);
    when(modelMapper.map(testActivity, ActivityDto.class)).thenReturn(new ActivityDto());

    // Act
    ActivityListResponseDto result =
        activityService.getByDayPlanId(testDayPlanId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
  }

  @Test
  void update_ShouldUpdateActivity() {
    // Arrange
    ActivityUpdateRequestDto updateRequestDto = new ActivityUpdateRequestDto();

    when(activityRepository.findByIdWithDayPlan(testActivityId))
        .thenReturn(Optional.of(testActivity));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

    // Create ActivityDto for the result instead of directly returning ActivityResponseDto
    ActivityDto activityDto = new ActivityDto();
    when(modelMapper.map(testActivity, ActivityDto.class)).thenReturn(activityDto);

    // Act
    ActivityResponseDto result = activityService.update(updateRequestDto, testActivityId);

    // Assert
    assertNotNull(result);
    assertEquals(activityDto, result.getData());
    verify(activityRepository, times(1)).save(any(Activity.class));
    verify(activityRepository, times(1)).flush();
  }

  @Test
  void delete_ShouldDeleteActivity() {
    // Arrange
    when(activityRepository.findById(testActivityId)).thenReturn(Optional.of(testActivity));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    // Act
    activityService.delete(testActivityId);

    // Assert
    verify(activityRepository, times(1)).delete(testActivity);
  }
}
