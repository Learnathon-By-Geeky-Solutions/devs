package com.devs.roamance.controller;

import com.devs.roamance.dto.request.social.RealTimeChatRequestDto;
import com.devs.roamance.dto.response.user.UserDto;
import com.devs.roamance.util.UserUtil;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class RealTimeChatController {

  private final SimpMessagingTemplate simpMessagingTemplate;
  private final UserUtil userUtil;
  private final ModelMapper modelMapper;

  public RealTimeChatController(
      SimpMessagingTemplate simpMessagingTemplate, UserUtil userUtil, ModelMapper modelMapper) {

    this.simpMessagingTemplate = simpMessagingTemplate;
    this.userUtil = userUtil;
    this.modelMapper = modelMapper;
  }

  @MessageMapping("/chat/{chatId}")
  public RealTimeChatRequestDto sendToUser(
      @Valid @Payload RealTimeChatRequestDto message, @DestinationVariable String chatId) {

    message.setUser(modelMapper.map(userUtil.getAuthenticatedUser(), UserDto.class));

    simpMessagingTemplate.convertAndSendToUser(chatId, "/queue/messages", message);

    return message;
  }
}
