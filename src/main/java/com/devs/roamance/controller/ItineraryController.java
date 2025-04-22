package com.devs.roamance.controller;

import com.devs.roamance.dto.request.travel.itinerary.ItineraryCreateRequestDto;
import com.devs.roamance.dto.request.travel.itinerary.ItineraryUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryListResponseDto;
import com.devs.roamance.dto.response.travel.itinerary.ItineraryResponseDto;
import com.devs.roamance.service.ItineraryService;
import com.devs.roamance.util.PaginationSortingUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/travel/itineraries")
public class ItineraryController {

  private final ItineraryService itineraryService;

  public ItineraryController(ItineraryService itineraryService) {

    this.itineraryService = itineraryService;
  }

  @PostMapping
  public ResponseEntity<ItineraryResponseDto> createItinerary(
      @Valid @RequestBody ItineraryCreateRequestDto requestDto) {

    ItineraryResponseDto responseDto = itineraryService.create(requestDto);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping
  public ResponseEntity<ItineraryListResponseDto> getAllItineraries(
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(defaultValue = "audit.createdAt") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    ItineraryListResponseDto responseDto =
        itineraryService.getAll(validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/{itineraryId}")
  public ResponseEntity<ItineraryResponseDto> getItineraryById(
      @PathVariable @NotNull UUID itineraryId) {

    ItineraryResponseDto responseDto = itineraryService.get(itineraryId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<ItineraryListResponseDto> getItinerariesByUserId(
      @PathVariable @NotNull UUID userId,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(defaultValue = "audit.createdAt") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    ItineraryListResponseDto responseDto =
        itineraryService.getByUserId(
            userId, validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }

  @PutMapping("/{itineraryId}")
  public ResponseEntity<ItineraryResponseDto> updateItinerary(
      @PathVariable @NotNull UUID itineraryId,
      @Valid @RequestBody ItineraryUpdateRequestDto requestDto) {

    ItineraryResponseDto responseDto = itineraryService.update(requestDto, itineraryId);

    return ResponseEntity.ok(responseDto);
  }

  @DeleteMapping("/{itineraryId}")
  public ResponseEntity<BaseResponseDto> deleteItinerary(@PathVariable @NotNull UUID itineraryId) {

    BaseResponseDto responseDto = itineraryService.delete(itineraryId);

    return ResponseEntity.ok(responseDto);
  }
}
