package com.devs.roamance.controller;

import com.devs.roamance.dto.request.user.UserInfoRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserInfoListResponseDto;
import com.devs.roamance.dto.response.user.UserInfoResponseDto;
import com.devs.roamance.service.UserInfoService;
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
@RequestMapping("/users/info")
public class UserInfoController {

  private final UserInfoService userInfoService;
  private final UserUtil userUtil;

  public UserInfoController(UserInfoService userInfoService, UserUtil userUtil) {
    this.userInfoService = userInfoService;
    this.userUtil = userUtil;
  }

  @GetMapping
  public ResponseEntity<UserInfoListResponseDto> getAllUsersInfo(
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "10") int pageSize,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {
    UserInfoListResponseDto responseDto =
        userInfoService.getAll(pageNumber, pageSize, sortBy, sortDir);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserInfoResponseDto> getUserInfoById(@PathVariable @NotNull UUID id) {
    UserInfoResponseDto responseDto = userInfoService.get(id);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @GetMapping("/me")
  public ResponseEntity<UserInfoResponseDto> getUserProfile() {

    UUID userId = userUtil.getAuthenticatedUser().getId();

    UserInfoResponseDto responseDto = userInfoService.getByUserId(userId);

    return ResponseEntity.ok(responseDto);
  }

  @PostMapping
  public ResponseEntity<UserInfoResponseDto> createUserInfo(
      @Valid @RequestBody UserInfoRequestDto requestDto) {
    UserInfoResponseDto responseDto = userInfoService.create(requestDto);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @PutMapping
  public ResponseEntity<UserInfoResponseDto> updateUserInfo(
      @Valid @RequestBody UserInfoRequestDto requestDto) {
    UUID userId = userUtil.getAuthenticatedUser().getId();
    UserInfoResponseDto responseDto = userInfoService.updateByUserId(requestDto, userId);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @PutMapping("/{id}")
  public ResponseEntity<UserInfoResponseDto> updateUserInfoById(
      @PathVariable @NotNull UUID id, @Valid @RequestBody UserInfoRequestDto requestDto) {
    UserInfoResponseDto responseDto = userInfoService.update(requestDto, id);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @DeleteMapping
  public ResponseEntity<BaseResponseDto> deleteUserInfo() {
    UUID userId = userUtil.getAuthenticatedUser().getId();
    BaseResponseDto responseDto = userInfoService.deleteByUserId(userId);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<BaseResponseDto> deleteUserInfoById(@PathVariable @NotNull UUID id) {
    BaseResponseDto responseDto = userInfoService.delete(id);
    return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
  }
}
