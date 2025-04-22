package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.travel.itinerary.ItineraryCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ItineraryUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryBriefDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryDetailDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedActionException;
import com.devs.roamance.model.travel.Location;
import com.devs.roamance.model.travel.itinerary.Itinerary;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ItineraryRepository;
import com.devs.roamance.service.ItineraryService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItineraryServiceImpl implements ItineraryService {

  private final ItineraryRepository itineraryRepository;
  private final ModelMapper modelMapper;
  private final UserUtil userUtil;

  public ItineraryServiceImpl(
      ItineraryRepository itineraryRepository, ModelMapper modelMapper, UserUtil userUtil) {

    this.itineraryRepository = itineraryRepository;
    this.modelMapper = modelMapper;
    this.userUtil = userUtil;
  }

  @Override
  @Transactional
  public ItineraryResponseDto create(ItineraryCreateRequestDto createRequestDto) {

    User user = userUtil.getAuthenticatedUser();

    Itinerary itinerary = modelMapper.map(createRequestDto, Itinerary.class);

    itinerary.setUser(user);

    Itinerary savedItinerary = itineraryRepository.save(itinerary);
    itineraryRepository.flush();

    ItineraryDetailDto dto = modelMapper.map(savedItinerary, ItineraryDetailDto.class);

    return new ItineraryResponseDto(201, true, ResponseMessage.ITINERARY_CREATE_SUCCESS, dto);
  }

  @Override
  public ItineraryListResponseDto getAll(
      int pageNumber, int pageSize, String sortBy, String sortDir) {

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Itinerary> itineraries = itineraryRepository.findAll(pageable);

    List<ItineraryBriefDto> dtos =
        itineraries.stream()
            .map(itinerary -> modelMapper.map(itinerary, ItineraryBriefDto.class))
            .toList();

    return new ItineraryListResponseDto(200, true, ResponseMessage.ITINERARIES_FETCH_SUCCESS, dtos);
  }

  @Override
  public ItineraryResponseDto get(UUID itineraryId) {

    Itinerary itinerary =
        itineraryRepository
            .findById(itineraryId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.ITINERARY_NOT_FOUND, itineraryId)));

    ItineraryDetailDto dto = modelMapper.map(itinerary, ItineraryDetailDto.class);

    return new ItineraryResponseDto(200, true, ResponseMessage.ITINERARY_FETCH_SUCCESS, dto);
  }

  @Override
  public ItineraryListResponseDto getByUserId(
      UUID userId, int pageNumber, int pageSize, String sortBy, String sortDir) {

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Itinerary> itineraries = itineraryRepository.findAllByUserId(userId, pageable);

    List<ItineraryBriefDto> dtos =
        itineraries.stream()
            .map(itinerary -> modelMapper.map(itinerary, ItineraryBriefDto.class))
            .toList();

    return new ItineraryListResponseDto(200, true, ResponseMessage.ITINERARIES_FETCH_SUCCESS, dtos);
  }

  @Override
  @Transactional
  public ItineraryResponseDto update(ItineraryUpdateRequestDto updateRequestDto, UUID itineraryId) {

    Itinerary existingItinerary =
        itineraryRepository
            .findById(itineraryId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.ITINERARY_NOT_FOUND, itineraryId)));

    UUID userId = userUtil.getAuthenticatedUser().getId();

    if (!existingItinerary.getUser().getId().equals(userId)) {
      throw new UnauthorizedActionException(ResponseMessage.ITINERARY_UPDATE_ACTION_DENIED);
    }

    if (updateRequestDto.getLocations() != null && !updateRequestDto.getLocations().isEmpty()) {

      existingItinerary.setLocations(
          new HashSet<>(
              updateRequestDto.getLocations().stream()
                  .map(location -> modelMapper.map(location, Location.class))
                  .toList()));
    }
    if (updateRequestDto.getTitle() != null && !updateRequestDto.getTitle().isEmpty()) {
      existingItinerary.setTitle(updateRequestDto.getTitle());
    }
    if (updateRequestDto.getDescription() != null && !updateRequestDto.getDescription().isEmpty()) {
      existingItinerary.setDescription(updateRequestDto.getDescription());
    }
    if (updateRequestDto.getStartDate() != null) {
      existingItinerary.setStartDate(updateRequestDto.getStartDate());
    }
    if (updateRequestDto.getEndDate() != null) {
      existingItinerary.setEndDate(updateRequestDto.getEndDate());
    }
    if (updateRequestDto.getNotes() != null && !updateRequestDto.getNotes().isEmpty()) {
      existingItinerary.setNotes(updateRequestDto.getNotes());
    }

    Itinerary savedItinerary = itineraryRepository.save(existingItinerary);
    itineraryRepository.flush();

    ItineraryDetailDto dto = modelMapper.map(savedItinerary, ItineraryDetailDto.class);

    return new ItineraryResponseDto(200, true, ResponseMessage.ITINERARY_UPDATE_SUCCESS, dto);
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID itineraryId) {

    Itinerary itinerary =
        itineraryRepository
            .findByIdLite(itineraryId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.ITINERARY_NOT_FOUND, itineraryId)));

    UUID userId = userUtil.getAuthenticatedUser().getId();

    if (!itinerary.getUser().getId().equals(userId)) {

      throw new UnauthorizedActionException(ResponseMessage.ITINERARY_DELETE_ACTION_DENIED);
    }

    itineraryRepository.delete(itinerary);

    return new BaseResponseDto(200, true, ResponseMessage.ITINERARY_DELETE_SUCCESS);
  }
}
