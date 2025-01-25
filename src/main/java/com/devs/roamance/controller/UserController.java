package com.devs.roamance.controller;

import com.devs.roamance.dto.request.UserRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.UserListResponseDto;
import com.devs.roamance.dto.response.UserResponseDto;
import com.devs.roamance.service.UserService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {


    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {

        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserListResponseDto> getAllUsers() {

        UserListResponseDto responseDtos = userService.getAllUsers();

        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable @NotNull Long userId) {

        UserResponseDto responseDto = userService.getUserById(userId);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserResponseDto> getUserByEmail(
            @RequestParam @Email @NotBlank String email) {

        UserResponseDto responseDto = userService.getUserByEmail(email);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/search")
    public ResponseEntity<UserListResponseDto> searchUsers(@RequestParam
                                                           @Pattern(regexp = "^[a-zA-Z0-9\\s]{1,50}$")
                                                           String query) {

        UserListResponseDto responseDtos = userService.searchUsers(query);

        return ResponseEntity.ok(responseDtos);
    }

    @PostMapping("/follow/{followerId}/{followeeId}")
    public ResponseEntity<BaseResponseDto> followUser(@PathVariable @NotNull Long followerId,
                                                      @PathVariable @NotNull Long followeeId) {

        if (followerId.equals(followeeId)) {

            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        BaseResponseDto responseDto = userService.followUser(followerId, followeeId);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<BaseResponseDto> updateUser(@RequestBody UserRequestDto requestDto,
                                                      @PathVariable @NotNull Long userId) {

        BaseResponseDto responseDto = userService.updateUser(requestDto, userId);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<BaseResponseDto> deleteUser(@PathVariable @NotNull Long userId) {

        BaseResponseDto responseDto = userService.deleteUser(userId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(responseDto);
    }
}
