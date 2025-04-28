package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.LocationUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.JournalCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.JournalUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.journal.JournalBriefDto;
import com.devs.roamance.dto.response.travel.journal.JournalDetailDto;
import com.devs.roamance.dto.response.travel.journal.JournalListResponseDto;
import com.devs.roamance.dto.response.travel.journal.JournalResponseDto;
import com.devs.roamance.exception.ResourceAlreadyExistException;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.common.Location;
import com.devs.roamance.model.travel.journal.ActivitySubsection;
import com.devs.roamance.model.travel.journal.Journal;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.JournalRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.impl.JournalServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class JournalServiceTest {

  @Mock private JournalRepository journalRepository;

  @Mock private UserRepository userRepository;

  @Mock private ModelMapper modelMapper;

  @Mock private UserUtil userUtil;

  @Mock private Authentication authentication;

  @Mock private SecurityContext securityContext;

  private JournalService journalService;
  private User testUser;
  private Journal testJournal;
  private JournalCreateRequestDto createRequestDto;
  private JournalUpdateRequestDto updateRequestDto;
  private JournalDetailDto journalDetailDto;
  private JournalBriefDto journalBriefDto;
  private UUID journalId;
  private UUID userId;

  @BeforeEach
  void setUp() {
    journalService =
        new JournalServiceImpl(journalRepository, userRepository, modelMapper, userUtil);

    // Setup test data
    journalId = UUID.randomUUID();
    userId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(userId);
    testUser.setEmail("test@example.com");

    testJournal = new Journal();
    testJournal.setId(journalId);
    testJournal.setTitle("Test Journal");
    testJournal.setDescription("Test Description");
    testJournal.setUser(testUser);

    createRequestDto = new JournalCreateRequestDto();
    createRequestDto.setTitle("New Journal");
    createRequestDto.setDescription("New Description");
    createRequestDto.setSubsections(new ArrayList<>());

    updateRequestDto = new JournalUpdateRequestDto();
    updateRequestDto.setTitle("Updated Journal");
    updateRequestDto.setDescription("Updated Description");
    updateRequestDto.setSubsections(new ArrayList<>());

    journalDetailDto = new JournalDetailDto();
    journalDetailDto.setId(journalId);
    journalDetailDto.setTitle("Test Journal");

    journalBriefDto = new JournalBriefDto();
    journalBriefDto.setId(journalId);
    journalBriefDto.setTitle("Test Journal");
  }

  @Test
  void create_ShouldCreateJournal() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(createRequestDto, Journal.class)).thenReturn(testJournal);
    when(journalRepository.save(any(Journal.class))).thenReturn(testJournal);
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(modelMapper.map(testJournal, JournalDetailDto.class)).thenReturn(journalDetailDto);

    // Act
    JournalResponseDto result = journalService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(journalDetailDto, result.getData());
    verify(journalRepository).save(any(Journal.class));
    verify(journalRepository).flush();
  }

  @Test
  void create_WithSubsections_ShouldCreateJournalWithSubsections() {
    // Arrange
    ActivitySubsectionCreateRequestDto subsectionDto = new ActivitySubsectionCreateRequestDto();
    subsectionDto.setTitle("Activity");
    createRequestDto.setSubsections(List.of(subsectionDto));

    ActivitySubsection activitySubsection = new ActivitySubsection();
    activitySubsection.setTitle("Activity");

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(createRequestDto, Journal.class)).thenReturn(testJournal);
    when(modelMapper.map(subsectionDto, ActivitySubsection.class)).thenReturn(activitySubsection);
    when(journalRepository.save(any(Journal.class))).thenReturn(testJournal);
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(modelMapper.map(testJournal, JournalDetailDto.class)).thenReturn(journalDetailDto);

    // Act
    JournalResponseDto result = journalService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());
    assertTrue(result.isSuccess());
  }

  @Test
  void create_WithDataIntegrityViolation_ShouldThrowResourceAlreadyExistsException() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(createRequestDto, Journal.class)).thenReturn(testJournal);
    when(journalRepository.save(any(Journal.class)))
        .thenThrow(DataIntegrityViolationException.class);

    // Act & Assert
    assertThrows(
        ResourceAlreadyExistException.class, () -> journalService.create(createRequestDto));
  }

  @Test
  void getAll_AsRegularUser_ShouldReturnUserJournals() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Journal> journals = Collections.singletonList(testJournal);
    Page<Journal> journalPage = new PageImpl<>(journals);

    when(securityContext.getAuthentication()).thenReturn(authentication);
    SecurityContextHolder.setContext(securityContext);

    when(authentication.getName()).thenReturn("test@example.com");
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    when(journalRepository.findAllByAudit_CreatedBy(eq(userId), any(Pageable.class)))
        .thenReturn(journalPage);
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(modelMapper.map(testJournal, JournalBriefDto.class)).thenReturn(journalBriefDto);

    // Act
    JournalListResponseDto result = journalService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(1, result.getData().size());
    assertEquals(journalBriefDto, result.getData().get(0));
  }

  @Test
  void getAll_AsAdmin_ShouldReturnAllJournals() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Journal> journals = Collections.singletonList(testJournal);
    Page<Journal> journalPage = new PageImpl<>(journals);

    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(true);
    when(journalRepository.findAll(any(Pageable.class))).thenReturn(journalPage);
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(modelMapper.map(testJournal, JournalBriefDto.class)).thenReturn(journalBriefDto);

    // Act
    JournalListResponseDto result = journalService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(1, result.getData().size());
  }

  @Test
  void get_WithValidId_ShouldReturnJournal() {
    // Arrange
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);
    when(modelMapper.map(testJournal, JournalDetailDto.class)).thenReturn(journalDetailDto);

    // Act
    JournalResponseDto result = journalService.get(journalId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(journalDetailDto, result.getData());
  }

  @Test
  void get_WithInvalidId_ShouldThrowResourceNotFoundException() {
    // Arrange
    when(journalRepository.findById(journalId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ResourceNotFoundException.class, () -> journalService.get(journalId));
  }

  @Test
  void get_WithUnauthorizedAccess_ShouldThrowUnauthorizedAccessException() {
    // Arrange
    User otherUser = new User();
    otherUser.setId(UUID.randomUUID());
    otherUser.setEmail("other@example.com");

    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(userUtil.getAuthenticatedUser()).thenReturn(otherUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);

    // Act & Assert
    assertThrows(UnauthorizedAccessException.class, () -> journalService.get(journalId));
  }

  @Test
  void update_ShouldUpdateJournal() {
    // Arrange
    LocationUpdateRequestDto locationDto = new LocationUpdateRequestDto();
    locationDto.setLatitude(40.7128); // New York latitude
    locationDto.setLongitude(-74.0060); // New York longitude

    updateRequestDto.setDestination(locationDto);

    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);
    when(modelMapper.map(locationDto, Location.class)).thenReturn(new Location());
    when(journalRepository.save(any(Journal.class))).thenReturn(testJournal);
    when(modelMapper.map(testJournal, JournalDetailDto.class)).thenReturn(journalDetailDto);

    // Act
    JournalResponseDto result = journalService.update(updateRequestDto, journalId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(journalDetailDto, result.getData());

    // Verify the journal was updated
    assertEquals("Updated Journal", testJournal.getTitle());
    assertEquals("Updated Description", testJournal.getDescription());

    verify(journalRepository).save(testJournal);
    verify(journalRepository).flush();
  }

  @Test
  void delete_ShouldDeleteJournal() {
    // Arrange
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userUtil.isAuthenticatedUserAdmin()).thenReturn(false);

    // Act
    BaseResponseDto result = journalService.delete(journalId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(ResponseMessage.JOURNAL_DELETE_SUCCESS, result.getMessage());
    verify(journalRepository).delete(testJournal);
  }
}
