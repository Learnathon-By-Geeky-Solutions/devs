package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.user.UserCreateRequestDto;
import com.devs.roamance.dto.request.user.UserUpdateRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.user.UserDto;
import com.devs.roamance.dto.response.user.UserListResponseDto;
import com.devs.roamance.dto.response.user.UserResponseDto;
import com.devs.roamance.exception.UserAlreadyExistException;
import com.devs.roamance.exception.UserNotFoundException;
import com.devs.roamance.model.user.Role;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.UserService;
import com.devs.roamance.util.PaginationSortingUtil;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final ModelMapper modelMapper;
  private final PasswordEncoder passwordEncoder;

  public UserServiceImpl(
      UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {

    this.userRepository = userRepository;
    this.modelMapper = modelMapper;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public UserResponseDto create(UserCreateRequestDto requestDto) {

    try {
      requestDto.setPassword(passwordEncoder.encode(requestDto.getPassword()));

      User user = modelMapper.map(requestDto, User.class);

      user.setRoles(Set.of(Role.USER));
      user.getInfo().setUser(user);
      user.getPreferences().setUser(user);

      User savedUser = userRepository.save(user);
      userRepository.flush();

      UserDto dto = modelMapper.map(savedUser, UserDto.class);
      return new UserResponseDto(201, true, ResponseMessage.REGISTRATION_SUCCESS, dto);

    } catch (DataIntegrityViolationException e) {

      throw new UserAlreadyExistException(
          String.format(ResponseMessage.USER_ALREADY_EXIST, requestDto.getEmail()));
    }
  }

  @Override
  public UserListResponseDto getAll(int pageNumber, int pageSize, String sortBy, String sortDir) {

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<User> userPage = userRepository.findAll(pageable);

    List<UserDto> dtoList =
        userPage.getContent().stream().map(user -> modelMapper.map(user, UserDto.class)).toList();

    return new UserListResponseDto(200, true, ResponseMessage.USERS_FETCH_SUCCESS, dtoList);
  }

  @Override
  public UserResponseDto get(UUID userId) {

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_ID, userId)));

    UserDto dto = modelMapper.map(user, UserDto.class);

    return new UserResponseDto(200, true, ResponseMessage.USER_FETCH_SUCCESS, dto);
  }

  @Override
  public UserResponseDto getByEmail(String email) {

    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_EMAIL, email)));

    UserDto dto = modelMapper.map(user, UserDto.class);

    return new UserResponseDto(200, true, ResponseMessage.USER_FETCH_SUCCESS, dto);
  }

  @Override
  public UserListResponseDto search(String query, int pageNumber, int pageSize) {

    Pageable pageable = PageRequest.of(pageNumber, pageSize);

    Page<User> userPage = userRepository.searchUsers(query, pageable);

    List<UserDto> dtoList =
        userPage.getContent().stream().map(user -> modelMapper.map(user, UserDto.class)).toList();

    return new UserListResponseDto(200, true, ResponseMessage.USERS_FETCH_SUCCESS, dtoList);
  }

  @Override
  @Transactional
  public UserResponseDto update(UserUpdateRequestDto requestDto, UUID userId) {

    User existingUser =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
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

    User savedUser = userRepository.save(existingUser);
    userRepository.flush();

    UserDto dto = modelMapper.map(savedUser, UserDto.class);

    return new UserResponseDto(200, true, ResponseMessage.USER_UPDATE_SUCCESS, dto);
  }

  @Override
  @Transactional
  public BaseResponseDto delete(UUID userId) {

    User existingUser =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_ID, userId)));

    userRepository.delete(existingUser);

    return new BaseResponseDto(200, true, ResponseMessage.USER_DELETE_SUCCESS);
  }
}
