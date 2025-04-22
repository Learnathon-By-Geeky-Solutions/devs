package com.devs.roamance.service.impl;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.social.MessageRequestDto;
import com.devs.roamance.dto.response.social.MessageDto;
import com.devs.roamance.dto.response.social.MessageListResponseDto;
import com.devs.roamance.dto.response.social.MessageResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.model.social.Chat;
import com.devs.roamance.model.social.Message;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ChatRepository;
import com.devs.roamance.repository.MessageRepository;
import com.devs.roamance.service.MessageService;
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
public class MessageServiceImpl implements MessageService {

  private final MessageRepository messageRepository;
  private final ChatRepository chatRepository;
  private final ModelMapper modelMapper;
  private final UserUtil userUtil;

  public MessageServiceImpl(
      MessageRepository messageRepository,
      ChatRepository chatRepository,
      ModelMapper modelMapper,
      UserUtil userUtil) {

    this.messageRepository = messageRepository;
    this.chatRepository = chatRepository;
    this.modelMapper = modelMapper;
    this.userUtil = userUtil;
  }

  @Override
  @Transactional
  public MessageResponseDto create(UUID chatId, MessageRequestDto requestDto) {

    User user = userUtil.getAuthenticatedUser();

    Chat chat =
        chatRepository
            .findById(chatId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.CHAT_NOT_FOUND, chatId)));

    Message newMessage = modelMapper.map(requestDto, Message.class);

    if (requestDto.getText() != null && !requestDto.getText().isEmpty()) {

      chat.setLastText(requestDto.getText());

    } else if (requestDto.getImagePaths() != null && !requestDto.getImagePaths().isEmpty()) {

      chat.setLastText(
          user.getName()
              + (requestDto.getImagePaths().size() == 1 ? " sent a photo" : " sent photos"));

    } else if (requestDto.getVideoPaths() != null && !requestDto.getVideoPaths().isEmpty()) {

      chat.setLastText(
          user.getName()
              + (requestDto.getVideoPaths().size() == 1 ? " sent a video" : " sent videos"));
    }

    newMessage.setUser(user);
    newMessage.setChat(chat);

    Message savedMessage = messageRepository.save(newMessage);
    messageRepository.flush();

    MessageDto dto = modelMapper.map(savedMessage, MessageDto.class);

    return new MessageResponseDto(201, true, ResponseMessage.MESSAGE_CREATE_SUCCESS, dto);
  }

  @Override
  public MessageListResponseDto getByChatId(
      UUID chatId, int pageNumber, int pageSize, String sortBy, String sortDir) {

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Message> messages = messageRepository.findAllByChatId(chatId, pageable);

    List<MessageDto> dtos =
        messages.stream().map(message -> modelMapper.map(message, MessageDto.class)).toList();

    return new MessageListResponseDto(200, true, ResponseMessage.MESSAGES_FETCH_SUCCESS, dtos);
  }
}
