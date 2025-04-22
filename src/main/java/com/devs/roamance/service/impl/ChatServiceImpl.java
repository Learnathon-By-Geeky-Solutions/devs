package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.response.social.ChatDto;
import com.devs.roamance.dto.response.social.ChatListResponseDto;
import com.devs.roamance.dto.response.social.ChatResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.exception.UserNotFoundException;
import com.devs.roamance.model.social.Chat;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ChatRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.ChatService;
import com.devs.roamance.util.PaginationSortingUtil;
import com.devs.roamance.util.UserUtil;
import java.util.List;
import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatServiceImpl implements ChatService {

  private final ChatRepository chatRepository;
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;
  private final UserUtil userUtil;

  public ChatServiceImpl(
      ChatRepository chatRepository,
      UserRepository userRepository,
      ModelMapper modelMapper,
      UserUtil userUtil) {

    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
    this.modelMapper = modelMapper;
    this.userUtil = userUtil;
  }

  @Override
  @Transactional
  public ChatResponseDto create(UUID userId) {

    User currentUser = userUtil.getAuthenticatedUser();

    User chatUser =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format(ResponseMessage.USER_NOT_FOUND_ID, userId)));

    Chat oldChat = chatRepository.findByUsers(currentUser, chatUser);

    if (oldChat != null) {

      ChatDto dto = modelMapper.map(oldChat, ChatDto.class);

      return new ChatResponseDto(200, true, ResponseMessage.CHAT_ALREADY_EXIST, dto);
    }

    Chat newChat = new Chat();
    newChat.getUsers().add(currentUser);
    newChat.getUsers().add(chatUser);

    Chat chat = chatRepository.save(newChat);

    ChatDto dto = modelMapper.map(chat, ChatDto.class);

    return new ChatResponseDto(201, true, ResponseMessage.CHAT_CREATE_SUCCESS, dto);
  }

  @Override
  public ChatResponseDto get(UUID chatId) {

    UUID currentUserId = userUtil.getAuthenticatedUser().getId();

    Chat chat =
        chatRepository
            .findById(chatId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.CHAT_NOT_FOUND, chatId)));

    if (!currentUserId.equals(chat.getUsers().get(0).getId())
        && !currentUserId.equals(chat.getUsers().get(1).getId())) {

      throw new UnauthorizedAccessException(ResponseMessage.CHAT_ACCESS_DENIED);
    }

    ChatDto dto = modelMapper.map(chat, ChatDto.class);

    return new ChatResponseDto(200, true, ResponseMessage.CHAT_FETCH_SUCCESS, dto);
  }

  @Override
  public ChatListResponseDto getForCurrentUser(
      Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {

    UUID userId = userUtil.getAuthenticatedUser().getId();

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Chat> chats = chatRepository.findAllByUsers_Id(userId, pageable);

    List<ChatDto> dtos = chats.stream().map(chat -> modelMapper.map(chat, ChatDto.class)).toList();

    return new ChatListResponseDto(200, true, ResponseMessage.CHATS_FETCH_SUCCESS, dtos);
  }
}
