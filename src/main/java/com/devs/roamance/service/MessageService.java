package com.devs.roamance.service;

import com.devs.roamance.dto.request.social.MessageRequestDto;
import com.devs.roamance.dto.response.social.MessageListResponseDto;
import com.devs.roamance.dto.response.social.MessageResponseDto;
import java.util.UUID;

public interface MessageService {

  MessageResponseDto create(UUID chatId, MessageRequestDto requestDto);

  MessageListResponseDto getByChatId(
      UUID chatId, int pageNumber, int pageSize, String sortBy, String sortDir);
}
