package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionBriefDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionDetailDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionListResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.audit.Audit;
import com.devs.roamance.model.travel.journal.ActivitySubsection;
import com.devs.roamance.model.travel.journal.Journal;
import com.devs.roamance.model.travel.journal.Subsection;
import com.devs.roamance.model.travel.journal.SubsectionType;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.JournalRepository;
import com.devs.roamance.repository.SubsectionRepository;
import com.devs.roamance.service.impl.SubsectionServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.lang.reflect.Field;
import java.util.*;
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
class SubsectionServiceTest {

  @Mock private SubsectionRepository subsectionRepository;

  @Mock private JournalRepository journalRepository;

  @Mock private ModelMapper modelMapper;

  @Mock private UserUtil userUtil;

  private SubsectionService subsectionService;
  private UUID subsectionId;
  private UUID journalId;
  private UUID userId;
  private User testUser;
  private Journal testJournal;
  private ActivitySubsection testSubsection;
  private ActivitySubsectionCreateRequestDto createRequestDto;
  private ActivitySubsectionUpdateRequestDto updateRequestDto;
  private SubsectionDetailDto subsectionDetailDto;
  private SubsectionBriefDto subsectionBriefDto;
  private Audit testAudit;

  @BeforeEach
  void setUp() {
    subsectionService =
        new SubsectionServiceImpl(subsectionRepository, journalRepository, modelMapper, userUtil);

    // Setup test data
    subsectionId = UUID.randomUUID();
    journalId = UUID.randomUUID();
    userId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(userId);

    testAudit = new Audit();
    // Can't set createdBy directly, use reflection instead
    try {
      Field createdByField = Audit.class.getDeclaredField("createdBy");
      createdByField.setAccessible(true);
      createdByField.set(testAudit, userId);
    } catch (Exception e) {
      // Handle exception
    }

    testJournal = new Journal();
    testJournal.setId(journalId);
    testJournal.setTitle("Test Journal");
    testJournal.setAudit(testAudit);

    testSubsection = new ActivitySubsection();
    testSubsection.setId(subsectionId);
    testSubsection.setTitle("Test Subsection");
    testSubsection.setJournal(testJournal);
    // No need to set type, it's determined by the class type

    createRequestDto = new ActivitySubsectionCreateRequestDto();
    createRequestDto.setJournalId(journalId);
    createRequestDto.setTitle("New Subsection");
    createRequestDto.setType(SubsectionType.ACTIVITY);

    updateRequestDto = new ActivitySubsectionUpdateRequestDto();
    updateRequestDto.setTitle("Updated Subsection");
    updateRequestDto.setType(SubsectionType.ACTIVITY);

    subsectionDetailDto = new SubsectionDetailDto();
    subsectionDetailDto.setId(subsectionId);
    subsectionDetailDto.setTitle("Test Subsection");
    subsectionDetailDto.setType(SubsectionType.ACTIVITY);

    subsectionBriefDto = new SubsectionBriefDto();
    subsectionBriefDto.setId(subsectionId);
    subsectionBriefDto.setTitle("Test Subsection");
    subsectionBriefDto.setType(SubsectionType.ACTIVITY);
  }

  @Test
  void create_ShouldCreateSubsection() {
    // Arrange
    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(
            any(ActivitySubsectionCreateRequestDto.class), eq(ActivitySubsection.class)))
        .thenReturn((ActivitySubsection) testSubsection);
    when(subsectionRepository.save(any(Subsection.class))).thenReturn(testSubsection);
    when(modelMapper.map(testSubsection, SubsectionDetailDto.class))
        .thenReturn(subsectionDetailDto);

    // Act
    SubsectionResponseDto result = subsectionService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(subsectionDetailDto, result.getData());
    verify(subsectionRepository).save(any(Subsection.class));
  }

  @Test
  void create_WithInvalidJournalId_ShouldThrowResourceNotFoundException() {
    // Arrange
    when(journalRepository.findById(journalId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ResourceNotFoundException.class, () -> subsectionService.create(createRequestDto));
  }

  @Test
  void create_WithUnauthorizedUser_ShouldThrowUnauthorizedAccessException() {
    // Arrange
    User unauthorizedUser = new User();
    unauthorizedUser.setId(UUID.randomUUID());

    when(journalRepository.findById(journalId)).thenReturn(Optional.of(testJournal));
    when(userUtil.getAuthenticatedUser()).thenReturn(unauthorizedUser);

    // Act & Assert
    assertThrows(
        UnauthorizedAccessException.class, () -> subsectionService.create(createRequestDto));
  }

  @Test
  void getAll_ShouldReturnSubsectionList() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Subsection> subsections = Collections.singletonList(testSubsection);
    Page<Subsection> subsectionPage = new PageImpl<>(subsections);

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(subsectionRepository.findAllByJournalAuditCreatedBy(eq(userId), any(Pageable.class)))
        .thenReturn(subsectionPage);
    when(modelMapper.map(testSubsection, SubsectionBriefDto.class)).thenReturn(subsectionBriefDto);

    // Act
    SubsectionListResponseDto result =
        subsectionService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    assertEquals(subsectionBriefDto, result.getData().get(0));
  }

  @Test
  void get_WithValidId_ShouldReturnSubsection() {
    // Arrange
    when(subsectionRepository.findById(subsectionId)).thenReturn(Optional.of(testSubsection));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(testSubsection, SubsectionDetailDto.class))
        .thenReturn(subsectionDetailDto);

    // Act
    SubsectionResponseDto result = subsectionService.get(subsectionId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(subsectionDetailDto, result.getData());
  }

  @Test
  void get_WithInvalidId_ShouldThrowResourceNotFoundException() {
    // Arrange
    when(subsectionRepository.findById(subsectionId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ResourceNotFoundException.class, () -> subsectionService.get(subsectionId));
  }

  @Test
  void get_WithUnauthorizedUser_ShouldThrowUnauthorizedAccessException() {
    // Arrange
    User unauthorizedUser = new User();
    unauthorizedUser.setId(UUID.randomUUID());

    when(subsectionRepository.findById(subsectionId)).thenReturn(Optional.of(testSubsection));
    when(userUtil.getAuthenticatedUser()).thenReturn(unauthorizedUser);

    // Act & Assert
    assertThrows(UnauthorizedAccessException.class, () -> subsectionService.get(subsectionId));
  }

  @Test
  void update_ShouldUpdateSubsection() {
    // Arrange
    ActivitySubsection activitySubsection = new ActivitySubsection();
    activitySubsection.setId(subsectionId);
    activitySubsection.setTitle("Test Subsection");
    activitySubsection.setJournal(testJournal);

    when(subsectionRepository.findById(subsectionId)).thenReturn(Optional.of(activitySubsection));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(subsectionRepository.save(any(Subsection.class))).thenReturn(activitySubsection);
    when(modelMapper.map(activitySubsection, SubsectionDetailDto.class))
        .thenReturn(subsectionDetailDto);

    // Act
    SubsectionResponseDto result = subsectionService.update(updateRequestDto, subsectionId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(subsectionDetailDto, result.getData());

    // Verify the subsection was updated
    assertEquals("Updated Subsection", activitySubsection.getTitle());

    verify(subsectionRepository).save(activitySubsection);
  }

  @Test
  void delete_ShouldDeleteSubsection() {
    // Arrange
    when(subsectionRepository.findById(subsectionId)).thenReturn(Optional.of(testSubsection));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    // Act
    BaseResponseDto result = subsectionService.delete(subsectionId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(ResponseMessage.SUBSECTION_DELETE_SUCCESS, result.getMessage());

    // Verify that the subsection was removed from journal and deleted
    assertNull(testSubsection.getJournal());
    verify(subsectionRepository).delete(testSubsection);
  }
}
