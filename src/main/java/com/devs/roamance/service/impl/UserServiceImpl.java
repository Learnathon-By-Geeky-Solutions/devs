package com.devs.roamance.service.impl;

import java.util.List;

import com.devs.roamance.dto.UserDto;
import com.devs.roamance.dto.request.UserRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.UserListResponseDto;
import com.devs.roamance.dto.response.UserResponseDto;
import com.devs.roamance.exception.UserNotFoundException;
import com.devs.roamance.model.User;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private static final String USER_NOT_FOUND_MESSAGE = "No user found for the given identifier: ";

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper) {

        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserListResponseDto getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserDto> dtos = users.stream().map(user -> modelMapper.map(user, UserDto.class)).toList();

        return new UserListResponseDto(200, true, "Users fetched successfully!", dtos);
    }

    @Override
    public UserResponseDto getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + userId));

        UserDto dto = modelMapper.map(user, UserDto.class);

        return new UserResponseDto(200, true, "User fetched successfully!", dto);
    }

    @Override
    public UserResponseDto getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + email));

        UserDto dto = modelMapper.map(user, UserDto.class);

        return new UserResponseDto(200, true, "User fetched successfully!", dto);
    }

    @Override
    public UserListResponseDto searchUsers(String query) {

        List<User> users = userRepository.searchUsers(query);

        List<UserDto> dtos = users.stream().map(user -> modelMapper.map(user, UserDto.class)).toList();

        return new UserListResponseDto(200, true, "Users fetched successfully!", dtos);
    }


    @Override
    public BaseResponseDto updateUser(UserRequestDto requestDto, Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + userId));

        if (requestDto.getName() != null && !requestDto.getName().isEmpty()) {
            existingUser.setName(requestDto.getName());
        }
        if (requestDto.getEmail() != null && !requestDto.getEmail().isEmpty()) {
            existingUser.setEmail(requestDto.getEmail());
        }
        if (requestDto.getPassword() != null && !requestDto.getPassword().isEmpty()) {
            existingUser.setPassword(requestDto.getPassword());
        }

        userRepository.save(existingUser);

        return new BaseResponseDto(200, true, "User updated successfully!");
    }

    @Override
    public BaseResponseDto followUser(Long followerId, Long followeeId) {

        if (followerId.equals(followeeId)) {

            throw new IllegalArgumentException("User cannot follow themselves");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + followerId));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + followeeId));

        if (follower.getFollowing().contains(followee)) {

            follower.getFollowing().remove(followee);
            followee.getFollowers().remove(follower);

            userRepository.save(follower);
            userRepository.save(followee);

            return new BaseResponseDto(200, true, "User unfollowed successfully!");
        } else {

            follower.getFollowing().add(followee);
            followee.getFollowers().add(follower);

            userRepository.save(follower);
            userRepository.save(followee);

            return new BaseResponseDto(200, true, "User followed successfully!");
        }
    }

    @Override
    public BaseResponseDto deleteUser(Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + userId));

        userRepository.delete(existingUser);

        return new BaseResponseDto(204, true, "User deleted successfully!");
    }
}