package com.devs.roamance.service.impl;

import java.util.List;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.UserDto;
import com.devs.roamance.dto.request.UserCreateRequestDto;
import com.devs.roamance.dto.request.UserUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.UserListResponseDto;
import com.devs.roamance.dto.response.UserResponseDto;
import com.devs.roamance.exception.UserAlreadyExistException;
import com.devs.roamance.exception.UserNotFoundException;
import com.devs.roamance.model.User;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.security.JwtUtils;
import com.devs.roamance.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper,
                           PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {

        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public BaseResponseDto create(UserCreateRequestDto requestDto) {

        try {
            requestDto.setPassword(passwordEncoder.encode(requestDto.getPassword()));

            User user = modelMapper.map(requestDto, User.class);

            userRepository.save(user);

            return new BaseResponseDto(201, true, ResponseMessage.REGISTRATION_SUCCESS);

        } catch (DataIntegrityViolationException e) {

            throw new UserAlreadyExistException(
                    String.format(ResponseMessage.USER_ALREADY_EXIST, requestDto.getEmail()));
        }
    }

    @Override
    public UserListResponseDto getAll() {

        List<User> users = userRepository.findAll();

        List<UserDto> dto = users.stream().map(user -> modelMapper.map(user, UserDto.class)).toList();

        return new UserListResponseDto(200, true, ResponseMessage.USERS_FETCH_SUCCESS, dto);
    }

    @Override
    public UserResponseDto getById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_ID, userId)));

        UserDto dto = modelMapper.map(user, UserDto.class);

        return new UserResponseDto(200, true, ResponseMessage.USER_FETCH_SUCCESS, dto);
    }

    @Override
    public UserResponseDto getByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_EMAIL, email)));

        UserDto dto = modelMapper.map(user, UserDto.class);

        return new UserResponseDto(200, true, ResponseMessage.USER_FETCH_SUCCESS, dto);
    }

    @Override
    public UserResponseDto getFromAuthHeader(String header) {

        String token = jwtUtils.getTokenFromHeader(header);

        String email = jwtUtils.getEmailFromToken(token);

        return getByEmail(email);
    }

    @Override
    public UserListResponseDto search(String query) {

        List<User> users = userRepository.searchUsers(query);

        List<UserDto> dto = users.stream().map(user -> modelMapper.map(user, UserDto.class)).toList();

        return new UserListResponseDto(200, true, ResponseMessage.USERS_FETCH_SUCCESS, dto);
    }

    @Override
    public BaseResponseDto update(UserUpdateRequestDto requestDto, Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_ID, userId)));

        if (requestDto.getName() != null && !requestDto.getName().isEmpty()) {
            existingUser.setName(requestDto.getName());
        }
        if (requestDto.getEmail() != null && !requestDto.getEmail().isEmpty()) {
            existingUser.setEmail(requestDto.getEmail());
        }
        if (requestDto.getPassword() != null && !requestDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        }

        userRepository.save(existingUser);

        return new BaseResponseDto(200, true, ResponseMessage.USER_UPDATE_SUCCESS);
    }

    @Override
    public BaseResponseDto delete(Long userId) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_ID, userId)));

        userRepository.delete(existingUser);

        return new BaseResponseDto(200, true, ResponseMessage.USER_DELETE_SUCCESS);
    }
}
