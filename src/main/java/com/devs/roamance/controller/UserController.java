package com.devs.roamance.controller;

import com.devs.roamance.dto.request.user.UserCreateRequestDto;
import com.devs.roamance.dto.request.user.UserUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserListResponseDto;
import com.devs.roamance.dto.response.user.UserResponseDto;
import com.devs.roamance.service.UserService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;
  private final UserUtil userUtil;

  public UserController(UserService userService, UserUtil userUtil) {

    this.userService = userService;
    this.userUtil = userUtil;
  }

  @PostMapping
  public ResponseEntity<BaseResponseDto> createUser(
      @Valid @RequestBody UserCreateRequestDto requestDto) {

    BaseResponseDto responseDto = userService.create(requestDto);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping
  public ResponseEntity<UserListResponseDto> getAllUsers(
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(defaultValue = "name") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    UserListResponseDto responseDto =
        userService.getAll(validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/{userId}")
  public ResponseEntity<UserResponseDto> getUserById(@PathVariable @NotNull UUID userId) {

    UserResponseDto responseDto = userService.get(userId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/by-email")
  public ResponseEntity<UserResponseDto> getUserByEmail(
      @RequestParam @Email @NotBlank String email) {

    UserResponseDto responseDto = userService.getByEmail(email);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponseDto> getUserProfile() {

    UUID userId = userUtil.getAuthenticatedUser().getId();

    UserResponseDto responseDto = userService.get(userId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/search")
  public ResponseEntity<UserListResponseDto> searchUsers(
      @RequestParam @NotBlank @Pattern(regexp = "^[a-zA-Z0-9\\s]{1,50}$") String query,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    UserListResponseDto responseDto =
        userService.search(query, validatedParams[0], validatedParams[1]);

    return ResponseEntity.ok(responseDto);
  }

  @PutMapping
  public ResponseEntity<BaseResponseDto> updateUser(
      @Valid @RequestBody UserUpdateRequestDto requestDto) {

    UUID userId = userUtil.getAuthenticatedUser().getId();

    BaseResponseDto responseDto = userService.update(requestDto, userId);

    return ResponseEntity.ok(responseDto);
  }

  @DeleteMapping
  public ResponseEntity<BaseResponseDto> deleteUser() {

    UUID userId = userUtil.getAuthenticatedUser().getId();

    BaseResponseDto responseDto = userService.delete(userId);

    return ResponseEntity.ok(responseDto);
  }
}
