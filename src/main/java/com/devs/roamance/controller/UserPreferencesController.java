package com.devs.roamance.controller;

import com.devs.roamance.dto.request.user.UserPreferencesRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesListResponseDto;
import com.devs.roamance.dto.response.user.UserPreferencesResponseDto;
import com.devs.roamance.service.UserPreferencesService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/preferences")
public class UserPreferencesController {

  private final UserPreferencesService userPreferencesService;
  private final UserUtil userUtil;

  public UserPreferencesController(
      UserPreferencesService userPreferencesService, UserUtil userUtil) {
    this.userPreferencesService = userPreferencesService;
    this.userUtil = userUtil;
  }

  @GetMapping
  public ResponseEntity<UserPreferencesListResponseDto> getAllUserPreferences(
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    UserPreferencesListResponseDto responseDto =
        userPreferencesService.getAll(validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserPreferencesResponseDto> getUserPreferencesById(
      @PathVariable @NotNull UUID id) {
    UserPreferencesResponseDto responseDto = userPreferencesService.get(id);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @GetMapping("/me")
  public ResponseEntity<UserPreferencesResponseDto> getCurrentUserPreferences() {
    UUID userId = userUtil.getAuthenticatedUser().getId();
    UserPreferencesResponseDto responseDto = userPreferencesService.getByUserId(userId);
    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<UserPreferencesResponseDto> getUserPreferencesByUserId(
      @PathVariable @NotNull UUID userId) {
    UserPreferencesResponseDto responseDto = userPreferencesService.getByUserId(userId);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @PostMapping
  public ResponseEntity<UserPreferencesResponseDto> createUserPreferences(
      @Valid @RequestBody UserPreferencesRequestDto requestDto) {
    UserPreferencesResponseDto responseDto = userPreferencesService.create(requestDto);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @PutMapping
  public ResponseEntity<UserPreferencesResponseDto> updateUserPreferences(
      @Valid @RequestBody UserPreferencesRequestDto requestDto) {
    UUID userId = userUtil.getAuthenticatedUser().getId();
    UserPreferencesResponseDto responseDto =
        userPreferencesService.updateByUserId(requestDto, userId);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @PutMapping("/{id}")
  public ResponseEntity<UserPreferencesResponseDto> updateUserPreferencesById(
      @PathVariable @NotNull UUID id, @Valid @RequestBody UserPreferencesRequestDto requestDto) {
    UserPreferencesResponseDto responseDto = userPreferencesService.update(requestDto, id);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @DeleteMapping
  public ResponseEntity<BaseResponseDto> deleteUserPreferences() {
    UUID userId = userUtil.getAuthenticatedUser().getId();
    BaseResponseDto responseDto = userPreferencesService.deleteByUserId(userId);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<BaseResponseDto> deleteUserPreferencesById(@PathVariable @NotNull UUID id) {
    BaseResponseDto responseDto = userPreferencesService.delete(id);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }
}
