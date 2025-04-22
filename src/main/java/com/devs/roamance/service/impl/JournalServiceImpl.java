package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.JournalCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.JournalUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.RouteSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SightseeingSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionCreateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.journal.JournalBriefDto;
import com.devs.roamance.dto.response.travel.journal.JournalDetailDto;
import com.devs.roamance.dto.response.travel.journal.JournalListResponseDto;
import com.devs.roamance.dto.response.travel.journal.JournalResponseDto;
import com.devs.roamance.exception.ResourceAlreadyExistException;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.travel.Location;
import com.devs.roamance.model.travel.journal.ActivitySubsection;
import com.devs.roamance.model.travel.journal.Journal;
import com.devs.roamance.model.travel.journal.RouteSubsection;
import com.devs.roamance.model.travel.journal.SightseeingSubsection;
import com.devs.roamance.model.travel.journal.Subsection;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.JournalRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.JournalService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class JournalServiceImpl implements JournalService {

  private final JournalRepository journalRepository;
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;
  private final UserUtil userUtil;

  public JournalServiceImpl(
      JournalRepository journalRepository,
      UserRepository userService,
      ModelMapper modelMapper,
      UserUtil userUtil) {
    this.journalRepository = journalRepository;
    this.userRepository = userService;
    this.modelMapper = modelMapper;
    this.userUtil = userUtil;
  }

  @Override
  @Transactional
  public JournalResponseDto create(JournalCreateRequestDto requestDto) {
    try {
      log.info(
          "Creating journal with title: '{}' and {} subsections",
          requestDto.getTitle(),
          requestDto.getSubsections().size());

      Journal journal = modelMapper.map(requestDto, Journal.class);

      log.info("Creating journal with title: '{}'", journal);

      if (!requestDto.getSubsections().isEmpty()) {
        for (SubsectionCreateRequestDto subsectionDto : requestDto.getSubsections()) {
          Subsection subsection =
              switch (subsectionDto) {
                case ActivitySubsectionCreateRequestDto activitySubsectionCreateRequestDto ->
                    modelMapper.map(subsectionDto, ActivitySubsection.class);
                case SightseeingSubsectionCreateRequestDto sightseeingSubsectionCreateRequestDto ->
                    modelMapper.map(subsectionDto, SightseeingSubsection.class);
                case RouteSubsectionCreateRequestDto routeSubsectionCreateRequestDto ->
                    modelMapper.map(subsectionDto, RouteSubsection.class);
                case null, default -> {
                  assert subsectionDto != null;
                  throw new IllegalArgumentException(
                      "Unknown subsection type: " + subsectionDto.getClass().getName());
                }
              };
          journal.addSubsection(subsection);
        }
        log.info(
            "Established bidirectional relationship for {} subsections",
            journal.getSubsections().size());
      }

      journal.setUser(userUtil.getAuthenticatedUser());

      Journal savedJournal = journalRepository.save(journal);
      journalRepository.flush();

      Journal dto =
          journalRepository
              .findById(savedJournal.getId())
              .orElseThrow(
                  () ->
                      new ResourceNotFoundException(
                          String.format(ResponseMessage.JOURNAL_NOT_FOUND, savedJournal.getId())));

      JournalDetailDto journalDetailDto = modelMapper.map(dto, JournalDetailDto.class);

      return new JournalResponseDto(
          201, true, ResponseMessage.JOURNAL_CREATE_SUCCESS, journalDetailDto);

    } catch (DataIntegrityViolationException e) {
      throw new ResourceAlreadyExistException(
          String.format(ResponseMessage.JOURNAL_ALREADY_EXIST, requestDto.getTitle()));
    }
  }

  @Override
  public JournalListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    boolean isAdmin = userUtil.isAuthenticatedUserAdmin();

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Journal> journalPage;

    if (isAdmin) {
      log.info("User has ADMIN role, returning all journals with pagination");
      journalPage = journalRepository.findAll(pageable);
    } else {
      String email = authentication.getName();
      Optional<UUID> userId = userRepository.findByEmail(email).map(User::getId);

      log.info("User has USER role, returning only their journals, userId: {}", userId);

      if (userId.isPresent()) {
        journalPage = journalRepository.findAllByAudit_CreatedBy(userId.get(), pageable);
      } else {
        return new JournalListResponseDto(
            200, true, ResponseMessage.JOURNALS_FETCH_SUCCESS, List.of());
      }
    }

    List<JournalBriefDto> journalDtos =
        journalPage.getContent().stream()
            .map(
                journal -> {
                  Journal journalWithSubsections =
                      journalRepository.findById(journal.getId()).orElse(journal);

                  JournalBriefDto dto =
                      modelMapper.map(journalWithSubsections, JournalBriefDto.class);
                  dto.setTotalSubsections(journalWithSubsections.getSubsections().size());
                  return dto;
                })
            .toList();

    return new JournalListResponseDto(
        200, true, ResponseMessage.JOURNALS_FETCH_SUCCESS, journalDtos);
  }

  @Override
  public JournalResponseDto get(UUID id) {
    log.info("Fetching journal with id: {} using JOIN FETCH for subsections", id);
    Journal journal = findJournalByAccess(id);

    log.info(
        "Successfully fetched journal with title: '{}' and {} subsections",
        journal.getTitle(),
        journal.getSubsections().size());

    JournalDetailDto journalDto = modelMapper.map(journal, JournalDetailDto.class);

    return new JournalResponseDto(200, true, ResponseMessage.JOURNAL_FETCH_SUCCESS, journalDto);
  }

  @Override
  @Transactional
  public JournalResponseDto update(JournalUpdateRequestDto updateRequestDto, UUID id) {
    Journal journal = findJournalByAccess(id);

    journal.setTitle(updateRequestDto.getTitle());
    journal.setDescription(updateRequestDto.getDescription());

    if (updateRequestDto.getDestination() != null) {
      journal.setDestination(modelMapper.map(updateRequestDto.getDestination(), Location.class));
    }

    Journal savedJournal = journalRepository.save(journal);
    journalRepository.flush();

    JournalDetailDto journalDetailDto = modelMapper.map(savedJournal, JournalDetailDto.class);

    return new JournalResponseDto(
        200, true, ResponseMessage.JOURNAL_UPDATE_SUCCESS, journalDetailDto);
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID id) {
    Journal journal = findJournalByAccess(id);

    journalRepository.delete(journal);

    return new BaseResponseDto(200, true, ResponseMessage.JOURNAL_DELETE_SUCCESS);
  }

  private Journal findJournalByAccess(UUID id) {
    Journal journal =
        journalRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.JOURNAL_NOT_FOUND, id)));
    User currentUser = userUtil.getAuthenticatedUser();
    boolean isAdmin = userUtil.isAuthenticatedUserAdmin();
    if (!isAdmin && !journal.getUser().getId().equals(currentUser.getId())) {
      log.warn(
          "User {} attempted to access journal {} without permission", currentUser.getEmail(), id);
      throw new UnauthorizedAccessException(ResponseMessage.JOURNAL_ACCESS_DENIED);
    }
    return journal;
  }
}
