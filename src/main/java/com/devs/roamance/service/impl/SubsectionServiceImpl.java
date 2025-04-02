package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.SubsectionDto;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.RouteSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.RouteSubsectionUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SightseeingSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SightseeingSubsectionUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionListResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionResponseDetailDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionResponseDto;
import com.devs.roamance.exception.JournalNotFoundException;
import com.devs.roamance.exception.SubsectionNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.Location;
import com.devs.roamance.model.User;
import com.devs.roamance.model.travel.journal.ActivitySubsection;
import com.devs.roamance.model.travel.journal.Journal;
import com.devs.roamance.model.travel.journal.RouteSubsection;
import com.devs.roamance.model.travel.journal.SightseeingSubsection;
import com.devs.roamance.model.travel.journal.Subsection;
import com.devs.roamance.model.travel.journal.SubsectionType;
import com.devs.roamance.repository.JournalRepository;
import com.devs.roamance.repository.SubsectionRepository;
import com.devs.roamance.service.SubsectionService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtils;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class SubsectionServiceImpl implements SubsectionService {
  private static final Logger logger = LoggerFactory.getLogger(SubsectionServiceImpl.class);

  private final SubsectionRepository subsectionRepository;
  private final JournalRepository journalRepository;
  private final ModelMapper modelMapper;
  private final UserUtils userUtils;

  public SubsectionServiceImpl(
      SubsectionRepository subsectionRepository,
      JournalRepository journalRepository,
      ModelMapper modelMapper,
      UserUtils userUtils) {
    this.subsectionRepository = subsectionRepository;
    this.journalRepository = journalRepository;
    this.modelMapper = modelMapper;
    this.userUtils = userUtils;
  }

  @Override
  public SubsectionResponseDto create(SubsectionCreateRequestDto requestDto) {
    logger.info(
        "Creating subsection with title: '{}' for journal with ID: {}",
        requestDto.getTitle(),
        requestDto.getJournalId());

    Journal journal =
        journalRepository
            .findById(requestDto.getJournalId())
            .orElseThrow(
                () ->
                    new JournalNotFoundException(
                        String.format(
                            ResponseMessage.JOURNAL_NOT_FOUND, requestDto.getJournalId())));

    validateUserAccess(journal, "create", requestDto.getJournalId());

    Subsection subsection = mapToSubsectionType(requestDto);
    subsection.setJournal(journal);

    Subsection savedSubsection = subsectionRepository.save(subsection);

    logger.info(
        "Successfully created subsection with ID: {} linked to journal: {}",
        savedSubsection.getId(),
        journal.getTitle());

    SubsectionResponseDetailDto detailDto = mapToSubsectionResponseDetailDto(savedSubsection);

    return new SubsectionResponseDto(
        201, true, ResponseMessage.SUBSECTION_CREATE_SUCCESS, detailDto);
  }

  @Override
  public SubsectionListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {
    logger.info(
        "Fetching all subsections with pagination - page: {}, size: {}, sortBy: {}, sortDir: {}",
        pageNumber,
        pageSize,
        sortBy,
        sortDir);

    User authenticatedUser = userUtils.getAuthenticatedUser();

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Subsection> subsectionPage =
        subsectionRepository.findAllByJournalCreatedBy(authenticatedUser.getId(), pageable);

    List<SubsectionDto> subsections =
        subsectionPage.getContent().stream()
            .map(
                subsection -> {
                  SubsectionDto subsectionDto = modelMapper.map(subsection, SubsectionDto.class);
                  subsectionDto.setJournalId(subsection.getJournal().getId());
                  return subsectionDto;
                })
            .toList();

    logger.info(
        "Successfully fetched {} subsections for user {}",
        subsections.size(),
        authenticatedUser.getId());
    return new SubsectionListResponseDto(
        200, true, ResponseMessage.SUBSECTIONS_FETCH_SUCCESS, subsections);
  }

  @Override
  public SubsectionResponseDto get(UUID id) {
    logger.info("Fetching subsection with id: {}", id);
    Subsection subsection =
        subsectionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new SubsectionNotFoundException(
                        String.format(ResponseMessage.SUBSECTION_NOT_FOUND, id)));

    Journal journal = subsection.getJournal();
    validateUserAccess(journal, "access", id);

    logger.info("Successfully fetched subsection with title: '{}'", subsection.getTitle());

    SubsectionResponseDetailDto detailDto = mapToSubsectionResponseDetailDto(subsection);

    return new SubsectionResponseDto(
        200, true, ResponseMessage.SUBSECTION_FETCH_SUCCESS, detailDto);
  }

  @Override
  public SubsectionResponseDto update(SubsectionUpdateRequestDto subsectionDetails, UUID id) {
    logger.info("Updating subsection with id: {}", id);

    Subsection subsection =
        subsectionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new SubsectionNotFoundException(
                        String.format(ResponseMessage.SUBSECTION_NOT_FOUND, id)));

    Journal journal = subsection.getJournal();
    validateUserAccess(journal, "update", id);

    subsection.setTitle(subsectionDetails.getTitle());

    updateSpecificFields(subsection, subsectionDetails);

    Subsection savedSubsection = subsectionRepository.save(subsection);
    logger.info("Successfully updated subsection with id: {}", id);

    SubsectionResponseDetailDto detailDto = mapToSubsectionResponseDetailDto(savedSubsection);

    return new SubsectionResponseDto(
        200, true, ResponseMessage.SUBSECTION_UPDATE_SUCCESS, detailDto);
  }

  @Override
  public BaseResponseDto delete(UUID id) {
    logger.info("Deleting subsection with id: {}", id);

    Subsection subsection =
        subsectionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new SubsectionNotFoundException(
                        String.format(ResponseMessage.SUBSECTION_NOT_FOUND, id)));

    Journal journal = subsection.getJournal();

    validateUserAccess(journal, "delete", id);

    logger.info("Detaching subsection from journal with ID: {}", journal.getId());
    journal.removeSubsection(subsection);
    subsection.setJournal(null);

    subsectionRepository.delete(subsection);

    logger.info("Successfully deleted subsection with id: {}", id);
    return new BaseResponseDto(200, true, ResponseMessage.SUBSECTION_DELETE_SUCCESS);
  }

  private void validateUserAccess(Journal journal, String operation, UUID resourceId) {
    User authenticatedUser = userUtils.getAuthenticatedUser();
    if (!journal.getCreatedBy().equals(authenticatedUser.getId())) {
      logger.error(
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
      Subsection subsection, SubsectionUpdateRequestDto subsectionDetails) {
    if (subsection instanceof ActivitySubsection activitySubsection
        && subsectionDetails instanceof ActivitySubsectionUpdateRequestDto activityDetails) {

      activitySubsection.setActivityName(activityDetails.getActivityName());
      if (activityDetails.getLocation() != null) {
        activitySubsection.setLocation(
            modelMapper.map(activityDetails.getLocation(), Location.class));
      }
    } else if (subsection instanceof SightseeingSubsection sightseeingSubsection
        && subsectionDetails instanceof SightseeingSubsectionUpdateRequestDto sightseeingDetails) {

      if (sightseeingDetails.getLocation() != null) {
        sightseeingSubsection.setLocation(
            modelMapper.map(sightseeingDetails.getLocation(), Location.class));
      }
    } else if (subsection instanceof RouteSubsection routeSubsection
        && subsectionDetails.getType() == SubsectionType.ROUTE) {

      try {
        RouteSubsectionUpdateRequestDto routeDetails =
            modelMapper.map(subsectionDetails, RouteSubsectionUpdateRequestDto.class);
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
        logger.error("Error mapping subsection details to RouteSubsectionUpdateRequestDto", e);
      }
    }
  }

  private SubsectionResponseDetailDto mapToSubsectionResponseDetailDto(Subsection subsection) {
    SubsectionResponseDetailDto detailDto = new SubsectionResponseDetailDto();
    detailDto.setId(subsection.getId());
    detailDto.setTitle(subsection.getTitle());
    detailDto.setNotes(subsection.getNotes());
    detailDto.setChecklists(subsection.getChecklists());
    detailDto.setJournalId(subsection.getJournal().getId());

    if (subsection instanceof ActivitySubsection) {
      detailDto.setType(SubsectionType.ACTIVITY);
    } else if (subsection instanceof SightseeingSubsection) {
      detailDto.setType(SubsectionType.SIGHTSEEING);
    } else if (subsection instanceof RouteSubsection) {
      detailDto.setType(SubsectionType.ROUTE);
    }

    return detailDto;
  }
}
