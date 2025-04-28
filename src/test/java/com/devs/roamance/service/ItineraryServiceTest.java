package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.common.AiPoweredItineraryDto;
import com.devs.roamance.dto.request.travel.itinerary.ItineraryCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ItineraryUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryBriefDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryDetailDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedActionException;
import com.devs.roamance.model.travel.itinerary.Itinerary;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ItineraryRepository;
import com.devs.roamance.service.impl.ItineraryServiceImpl;
import com.devs.roamance.util.ItineraryUtil;
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
class ItineraryServiceTest {

  @Mock private ItineraryRepository itineraryRepository;

  @Mock private ItineraryUtil itineraryUtil;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private ItineraryService itineraryService;

  private User testUser;
  private Itinerary testItinerary;
  private UUID testItineraryId;
  private UUID testUserId;

  @BeforeEach
  void setUp() {
    itineraryService =
        new ItineraryServiceImpl(itineraryRepository, itineraryUtil, modelMapper, userUtil);

    // Setup test data
    testUserId = UUID.randomUUID();
    testItineraryId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testItinerary = new Itinerary();
    testItinerary.setId(testItineraryId);
    testItinerary.setUser(testUser);
    testItinerary.setTitle("Test Itinerary");
    testItinerary.setDescription("Test Description");
    testItinerary.setStartDate(LocalDate.now());
    testItinerary.setEndDate(LocalDate.now().plusDays(5));
  }

  @Test
  void create_ShouldCreateNewItinerary() {
    // Arrange
    ItineraryCreateRequestDto createRequestDto = new ItineraryCreateRequestDto();
    createRequestDto.setTitle("Test Itinerary");
    createRequestDto.setDescription("Test Description");
    createRequestDto.setStartDate(LocalDate.now());
    createRequestDto.setEndDate(LocalDate.now().plusDays(5));

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(createRequestDto, Itinerary.class)).thenReturn(testItinerary);
    when(itineraryRepository.save(any(Itinerary.class))).thenReturn(testItinerary);

    ItineraryDetailDto itineraryDetailDto = new ItineraryDetailDto();
    when(modelMapper.map(testItinerary, ItineraryDetailDto.class)).thenReturn(itineraryDetailDto);

    // Act
    ItineraryResponseDto result = itineraryService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(itineraryDetailDto, result.getData());
    verify(itineraryRepository, times(1)).save(any(Itinerary.class));
    verify(itineraryRepository, times(1)).flush();
  }

  @Test
  void createWithDetails_ShouldCreateNewItineraryWithDetails() {
    // Arrange
    AiPoweredItineraryDto aiPoweredItineraryDto = new AiPoweredItineraryDto();

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(itineraryRepository.save(any(Itinerary.class))).thenReturn(testItinerary);

    ItineraryDetailDto itineraryDetailDto = new ItineraryDetailDto();
    when(modelMapper.map(testItinerary, ItineraryDetailDto.class)).thenReturn(itineraryDetailDto);

    // Act
    ItineraryResponseDto result = itineraryService.createWithDetails(aiPoweredItineraryDto);

    // Assert
    assertNotNull(result);
    assertEquals(itineraryDetailDto, result.getData());
    verify(itineraryUtil, times(1))
        .mapToDayPlansAndActivities(any(Itinerary.class), eq(aiPoweredItineraryDto), eq(testUser));
    verify(itineraryUtil, times(1)).validateDayPlansAndActivities(any(Itinerary.class));
    verify(itineraryRepository, times(1)).save(any(Itinerary.class));
    verify(itineraryRepository, times(1)).flush();
  }

  @Test
  void getAll_ShouldReturnAllItineraries() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "startDate";
    String sortDir = "asc";

    List<Itinerary> itineraries = new ArrayList<>();
    itineraries.add(testItinerary);
    Page<Itinerary> itineraryPage = new PageImpl<>(itineraries);

    when(itineraryRepository.findAll(any(Pageable.class))).thenReturn(itineraryPage);

    ItineraryBriefDto itineraryBriefDto = new ItineraryBriefDto();
    when(modelMapper.map(testItinerary, ItineraryBriefDto.class)).thenReturn(itineraryBriefDto);

    // Act
    ItineraryListResponseDto result =
        itineraryService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(itineraryRepository, times(1)).findAll(any(Pageable.class));
  }

  @Test
  void get_ShouldReturnItinerary() {
    // Arrange
    when(itineraryRepository.findById(testItineraryId)).thenReturn(Optional.of(testItinerary));

    ItineraryDetailDto itineraryDetailDto = new ItineraryDetailDto();
    when(modelMapper.map(testItinerary, ItineraryDetailDto.class)).thenReturn(itineraryDetailDto);

    // Act
    ItineraryResponseDto result = itineraryService.get(testItineraryId);

    // Assert
    assertNotNull(result);
    assertEquals(itineraryDetailDto, result.getData());
    verify(itineraryRepository, times(1)).findById(testItineraryId);
  }

  @Test
  void get_ShouldThrowException_WhenItineraryNotFound() {
    // Arrange
    when(itineraryRepository.findById(testItineraryId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> itineraryService.get(testItineraryId),
        String.format(ResponseMessage.ITINERARY_NOT_FOUND, testItineraryId));
  }

  @Test
  void getByUserId_ShouldReturnItineraries() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "startDate";
    String sortDir = "asc";

    List<Itinerary> itineraries = new ArrayList<>();
    itineraries.add(testItinerary);
    Page<Itinerary> itineraryPage = new PageImpl<>(itineraries);

    when(itineraryRepository.findAllByUserId(eq(testUserId), any(Pageable.class)))
        .thenReturn(itineraryPage);

    ItineraryBriefDto itineraryBriefDto = new ItineraryBriefDto();
    when(modelMapper.map(testItinerary, ItineraryBriefDto.class)).thenReturn(itineraryBriefDto);

    // Act
    ItineraryListResponseDto result =
        itineraryService.getByUserId(testUserId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(itineraryRepository, times(1)).findAllByUserId(eq(testUserId), any(Pageable.class));
  }

  @Test
  void update_ShouldUpdateItinerary() {
    // Arrange
    ItineraryUpdateRequestDto updateRequestDto = new ItineraryUpdateRequestDto();
    updateRequestDto.setTitle("Updated Title");
    updateRequestDto.setDescription("Updated Description");

    when(itineraryRepository.findById(testItineraryId)).thenReturn(Optional.of(testItinerary));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(itineraryRepository.save(any(Itinerary.class))).thenReturn(testItinerary);

    ItineraryDetailDto itineraryDetailDto = new ItineraryDetailDto();
    when(modelMapper.map(testItinerary, ItineraryDetailDto.class)).thenReturn(itineraryDetailDto);

    // Act
    ItineraryResponseDto result = itineraryService.update(updateRequestDto, testItineraryId);

    // Assert
    assertNotNull(result);
    assertEquals(itineraryDetailDto, result.getData());
    verify(itineraryRepository, times(1)).save(any(Itinerary.class));
    verify(itineraryRepository, times(1)).flush();
  }

  @Test
  void update_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    ItineraryUpdateRequestDto updateRequestDto = new ItineraryUpdateRequestDto();

    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(itineraryRepository.findById(testItineraryId)).thenReturn(Optional.of(testItinerary));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedActionException.class,
        () -> itineraryService.update(updateRequestDto, testItineraryId),
        ResponseMessage.ITINERARY_UPDATE_ACTION_DENIED);
  }

  @Test
  void delete_ShouldDeleteItinerary() {
    // Arrange
    when(itineraryRepository.findByIdLite(testItineraryId)).thenReturn(Optional.of(testItinerary));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    // Act
    BaseResponseDto result = itineraryService.delete(testItineraryId);

    // Assert
    assertNotNull(result);
    verify(itineraryRepository, times(1)).delete(testItinerary);
  }

  @Test
  void delete_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(itineraryRepository.findByIdLite(testItineraryId)).thenReturn(Optional.of(testItinerary));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedActionException.class,
        () -> itineraryService.delete(testItineraryId),
        ResponseMessage.ITINERARY_DELETE_ACTION_DENIED);
  }

  @Test
  void delete_ShouldThrowException_WhenItineraryNotFound() {
    // Arrange
    when(itineraryRepository.findByIdLite(testItineraryId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> itineraryService.delete(testItineraryId),
        String.format(ResponseMessage.ITINERARY_NOT_FOUND, testItineraryId));
  }
}
