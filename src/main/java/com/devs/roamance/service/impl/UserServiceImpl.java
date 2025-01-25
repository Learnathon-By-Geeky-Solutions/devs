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
    public BaseResponseDto followUser(Long userId1, Long userId2) {

        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + userId1));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND_MESSAGE + userId2));

        if (user1.getFollowings().contains(userId2)) {

            user1.getFollowings().remove(userId2);
            user2.getFollowers().remove(userId1);

            userRepository.save(user1);
            userRepository.save(user2);

            return new BaseResponseDto(200, true, "User unfollowed successfully!");
        } else {
            user1.getFollowings().add(userId2);
            user2.getFollowers().add(userId1);

            userRepository.save(user1);
            userRepository.save(user2);

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