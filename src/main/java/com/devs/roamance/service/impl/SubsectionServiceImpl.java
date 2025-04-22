package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.RouteSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.RouteSubsectionUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SightseeingSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SightseeingSubsectionUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionBriefDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionDetailDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionListResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.travel.Location;
import com.devs.roamance.model.travel.journal.ActivitySubsection;
import com.devs.roamance.model.travel.journal.Journal;
import com.devs.roamance.model.travel.journal.RouteSubsection;
import com.devs.roamance.model.travel.journal.SightseeingSubsection;
import com.devs.roamance.model.travel.journal.Subsection;
import com.devs.roamance.model.travel.journal.SubsectionType;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.JournalRepository;
import com.devs.roamance.repository.SubsectionRepository;
import com.devs.roamance.service.SubsectionService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SubsectionServiceImpl implements SubsectionService {

  private final SubsectionRepository subsectionRepository;
  private final JournalRepository journalRepository;
  private final ModelMapper modelMapper;
  private final UserUtil userUtil;

  public SubsectionServiceImpl(
      SubsectionRepository subsectionRepository,
      JournalRepository journalRepository,
      ModelMapper modelMapper,
      UserUtil userUtil) {
    this.subsectionRepository = subsectionRepository;
    this.journalRepository = journalRepository;
    this.modelMapper = modelMapper;
    this.userUtil = userUtil;
  }

  @Override
  public SubsectionResponseDto create(SubsectionCreateRequestDto requestDto) {
    log.info(
        "Creating subsection with title: '{}' for journal with ID: {}",
        requestDto.getTitle(),
        requestDto.getJournalId());

    Journal journal =
        journalRepository
            .findById(requestDto.getJournalId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(
                            ResponseMessage.JOURNAL_NOT_FOUND, requestDto.getJournalId())));

    validateUserAccess(journal, "create", requestDto.getJournalId());

    Subsection subsection = mapToSubsectionType(requestDto);
    subsection.setJournal(journal);

    Subsection savedSubsection = subsectionRepository.save(subsection);

    log.info(
        "Successfully created subsection with ID: {} linked to journal: {}",
        savedSubsection.getId(),
        journal.getTitle());

    SubsectionDetailDto detailDto = modelMapper.map(savedSubsection, SubsectionDetailDto.class);

    return new SubsectionResponseDto(
        201, true, ResponseMessage.SUBSECTION_CREATE_SUCCESS, detailDto);
  }

  @Override
  public SubsectionListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {
    log.info(
        "Fetching all subsections with pagination - page: {}, size: {}, sortBy: {}, sortDir: {}",
        pageNumber,
        pageSize,
        sortBy,
        sortDir);

    User authenticatedUser = userUtil.getAuthenticatedUser();

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Subsection> subsectionPage =
        subsectionRepository.findAllByJournalAuditCreatedBy(authenticatedUser.getId(), pageable);

    List<SubsectionBriefDto> subsections =
        subsectionPage.getContent().stream()
            .map(
                subsection -> {
                  SubsectionBriefDto subsectionBriefDto =
                      modelMapper.map(subsection, SubsectionBriefDto.class);
                  subsectionBriefDto.setJournalId(subsection.getJournal().getId());
                  return subsectionBriefDto;
                })
            .toList();

    log.info(
        "Successfully fetched {} subsections for user {}",
        subsections.size(),
        authenticatedUser.getId());
    return new SubsectionListResponseDto(
        200, true, ResponseMessage.SUBSECTIONS_FETCH_SUCCESS, subsections);
  }

  @Override
  public SubsectionResponseDto get(UUID id) {
    log.info("Fetching subsection with id: {}", id);
    Subsection subsection =
        subsectionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.SUBSECTION_NOT_FOUND, id)));

    Journal journal = subsection.getJournal();
    validateUserAccess(journal, "access", id);

    log.info("Successfully fetched subsection with title: '{}'", subsection.getTitle());

    SubsectionDetailDto detailDto = modelMapper.map(subsection, SubsectionDetailDto.class);

    return new SubsectionResponseDto(
        200, true, ResponseMessage.SUBSECTION_FETCH_SUCCESS, detailDto);
  }

  @Override
  public SubsectionResponseDto update(SubsectionUpdateRequestDto updateRequestDto, UUID id) {
    log.info("Updating subsection with id: {}", id);

    Subsection subsection =
        subsectionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.SUBSECTION_NOT_FOUND, id)));

    Journal journal = subsection.getJournal();
    validateUserAccess(journal, "update", id);

    subsection.setTitle(updateRequestDto.getTitle());

    updateSpecificFields(subsection, updateRequestDto);

    Subsection savedSubsection = subsectionRepository.save(subsection);
    log.info("Successfully updated subsection with id: {}", id);

    SubsectionDetailDto detailDto = modelMapper.map(savedSubsection, SubsectionDetailDto.class);

    return new SubsectionResponseDto(
        200, true, ResponseMessage.SUBSECTION_UPDATE_SUCCESS, detailDto);
  }

  @Override
  public BaseResponseDto delete(UUID id) {
    log.info("Deleting subsection with id: {}", id);

    Subsection subsection =
        subsectionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.SUBSECTION_NOT_FOUND, id)));

    Journal journal = subsection.getJournal();

    validateUserAccess(journal, "delete", id);

    log.info("Detaching subsection from journal with ID: {}", journal.getId());
    journal.removeSubsection(subsection);
    subsection.setJournal(null);

    subsectionRepository.delete(subsection);

    log.info("Successfully deleted subsection with id: {}", id);
    return new BaseResponseDto(200, true, ResponseMessage.SUBSECTION_DELETE_SUCCESS);
  }

  private void validateUserAccess(Journal journal, String operation, UUID resourceId) {
    User authenticatedUser = userUtil.getAuthenticatedUser();
    if (!journal.getAudit().getCreatedBy().equals(authenticatedUser.getId())) {
      log.error(
          "User {} not authorized to {} resource {}",
          authenticatedUser.getId(),
          operation,
          resourceId);
      throw new UnauthorizedAccessException(
          "You are not authorized to " + operation + " this resource");
    }
  }

  private Subsection mapToSubsectionType(SubsectionCreateRequestDto subsectionDto) {
    return switch (subsectionDto) {
      case ActivitySubsectionCreateRequestDto activityDto ->
          modelMapper.map(subsectionDto, ActivitySubsection.class);
      case SightseeingSubsectionCreateRequestDto sightseeingDto ->
          modelMapper.map(subsectionDto, SightseeingSubsection.class);
      case RouteSubsectionCreateRequestDto routeDto ->
          modelMapper.map(subsectionDto, RouteSubsection.class);
      case null, default ->
          throw new IllegalArgumentException(
              "Unknown subsection type: " + subsectionDto.getClass().getName());
    };
  }

  private void updateSpecificFields(
      Subsection subsection, SubsectionUpdateRequestDto updateRequestDto) {
    if (subsection instanceof ActivitySubsection activitySubsection
        && updateRequestDto instanceof ActivitySubsectionUpdateRequestDto activityDetails) {

      activitySubsection.setActivityName(activityDetails.getActivityName());
      if (activityDetails.getLocation() != null) {
        activitySubsection.setLocation(
            modelMapper.map(activityDetails.getLocation(), Location.class));
      }
    } else if (subsection instanceof SightseeingSubsection sightseeingSubsection
        && updateRequestDto instanceof SightseeingSubsectionUpdateRequestDto sightseeingDetails) {

      if (sightseeingDetails.getLocation() != null) {
        sightseeingSubsection.setLocation(
            modelMapper.map(sightseeingDetails.getLocation(), Location.class));
      }
    } else if (subsection instanceof RouteSubsection routeSubsection
        && updateRequestDto.getType() == SubsectionType.ROUTE) {

      try {
        RouteSubsectionUpdateRequestDto routeDetails =
            modelMapper.map(updateRequestDto, RouteSubsectionUpdateRequestDto.class);
        routeSubsection.setTotalTime(routeDetails.getTotalTime());
        routeSubsection.setTotalDistance(routeDetails.getTotalDistance());
        if (routeDetails.getLocations() != null && !routeDetails.getLocations().isEmpty()) {
          List<Location> locations =
              routeDetails.getLocations().stream()
                  .map(loc -> modelMapper.map(loc, Location.class))
                  .toList();
          routeSubsection.setLocations(locations);
        }
      } catch (Exception e) {
        log.error("Error mapping subsection details to RouteSubsectionUpdateRequestDto", e);
      }
    }
  }
}
