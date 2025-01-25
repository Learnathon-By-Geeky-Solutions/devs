package com.devs.roamance.controller;

import com.devs.roamance.dto.request.UserRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.UserListResponseDto;
import com.devs.roamance.dto.response.UserResponseDto;
import com.devs.roamance.service.UserService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long userId) {

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

    @PutMapping("/update/{userId}")
    public ResponseEntity<BaseResponseDto> updateUser(@RequestBody UserRequestDto requestDto,
                                                      @PathVariable Long userId) {

        BaseResponseDto responseDto = userService.updateUser(requestDto, userId);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/follow/{userId1}/{userId2}")
    public ResponseEntity<BaseResponseDto> followUser(@PathVariable Long userId1,
                                                      @PathVariable Long userId2) {

        BaseResponseDto responseDto = userService.followUser(userId1, userId2);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<BaseResponseDto> deleteUser(@PathVariable Long userId) {

        BaseResponseDto responseDto = userService.deleteUser(userId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(responseDto);
    }
}
