package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.journal.ActivitySubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.JournalCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.JournalUpdateRequestDto;
import com.devs.roamance.dto.request.travel.journal.RouteSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SightseeingSubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionCreateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.journal.JournalDto;
import com.devs.roamance.dto.response.travel.journal.JournalListResponseDto;
import com.devs.roamance.dto.response.travel.journal.JournalResponseDto;
import com.devs.roamance.exception.JournalAlreadyExistException;
import com.devs.roamance.exception.JournalNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.Location;
import com.devs.roamance.model.User;
import com.devs.roamance.model.travel.journal.ActivitySubsection;
import com.devs.roamance.model.travel.journal.Journal;
import com.devs.roamance.model.travel.journal.RouteSubsection;
import com.devs.roamance.model.travel.journal.SightseeingSubsection;
import com.devs.roamance.model.travel.journal.Subsection;
import com.devs.roamance.repository.JournalRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.JournalService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JournalServiceImpl implements JournalService {
  private static final Logger logger = LoggerFactory.getLogger(JournalServiceImpl.class);

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
      logger.info(
          "Creating journal with title: '{}' and {} subsections",
          requestDto.getTitle(),
          requestDto.getSubsections().size());

      Journal journal = modelMapper.map(requestDto, Journal.class);

      logger.info("Creating journal with title: '{}'", journal);

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
        logger.info(
            "Established bidirectional relationship for {} subsections",
            journal.getSubsections().size());
      }

      journal.setUser(userUtil.getAuthenticatedUser());

      Journal savedJournal = journalRepository.save(journal);

      Journal dto =
          journalRepository
              .findById(savedJournal.getId())
              .orElseThrow(
                  () ->
                      new JournalNotFoundException(
                          String.format(ResponseMessage.JOURNAL_NOT_FOUND, savedJournal.getId())));

      return new JournalResponseDto(201, true, ResponseMessage.JOURNAL_CREATE_SUCCESS, dto);

    } catch (DataIntegrityViolationException e) {
      throw new JournalAlreadyExistException(
          String.format(ResponseMessage.JOURNAL_ALREADY_EXIST, requestDto.getTitle()));
    }
  }

  @Override
  public JournalListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    boolean isAdmin =
        authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Journal> journalPage;

    if (isAdmin) {
      logger.info("User has ADMIN role, returning all journals with pagination");
      journalPage = journalRepository.findAll(pageable);
    } else {
      String email = authentication.getName();
      Optional<UUID> userId = userRepository.findByEmail(email).map(User::getId);

      logger.info("User has USER role, returning only their journals, userId: {}", userId);

      if (userId.isPresent()) {
        journalPage = journalRepository.findAllByCreatedBy(userId.get(), pageable);
      } else {
        return new JournalListResponseDto(
            200, true, ResponseMessage.JOURNALS_FETCH_SUCCESS, List.of());
      }
    }

    List<JournalDto> journalDtos =
        journalPage.getContent().stream()
            .map(
                journal -> {
                  Journal journalWithSubsections =
                      journalRepository.findById(journal.getId()).orElse(journal);

                  JournalDto dto = modelMapper.map(journalWithSubsections, JournalDto.class);
                  dto.setTotalSubsections(journalWithSubsections.getSubsections().size());
                  return dto;
                })
            .toList();

    return new JournalListResponseDto(
        200, true, ResponseMessage.JOURNALS_FETCH_SUCCESS, journalDtos);
  }

  @Override
  public JournalResponseDto get(UUID id) {
    logger.info("Fetching journal with id: {} using JOIN FETCH for subsections", id);
    Journal journal =
        journalRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new JournalNotFoundException(
                        String.format(ResponseMessage.JOURNAL_NOT_FOUND, id)));

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = userUtil.getAuthenticatedUser();
    boolean isAdmin =
        authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

    if (!isAdmin && !journal.getUser().getId().equals(currentUser.getId())) {
      logger.warn(
          "User {} attempted to access journal {} without permission", currentUser.getEmail(), id);
      throw new UnauthorizedAccessException(ResponseMessage.JOURNAL_ACCESS_DENIED);
    }

    logger.info(
        "Successfully fetched journal with title: '{}' and {} subsections",
        journal.getTitle(),
        journal.getSubsections().size());
    return new JournalResponseDto(200, true, ResponseMessage.JOURNAL_FETCH_SUCCESS, journal);
  }

  @Override
  @Transactional
  public JournalResponseDto update(JournalUpdateRequestDto requestDto, UUID id) {
    Journal journal = get(id).getData();

    journal.setTitle(requestDto.getTitle());
    journal.setDescription(requestDto.getDescription());

    if (requestDto.getDestination() != null) {
      journal.setDestination(modelMapper.map(requestDto.getDestination(), Location.class));
    }

    Journal savedJournal = journalRepository.save(journal);
    journalRepository.flush();

    return new JournalResponseDto(200, true, ResponseMessage.JOURNAL_UPDATE_SUCCESS, savedJournal);
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID id) {
    Journal journal = get(id).getData();

    journalRepository.delete(journal);

    return new BaseResponseDto(200, true, ResponseMessage.JOURNAL_DELETE_SUCCESS);
  }
}
