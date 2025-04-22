package com.devs.roamance.service;

import com.devs.roamance.dto.response.social.ChatListResponseDto;
import com.devs.roamance.dto.response.social.ChatResponseDto;
import java.util.UUID;

public interface ChatService {

  ChatResponseDto create(UUID userId);

  ChatResponseDto get(UUID chatId);

  ChatListResponseDto getForCurrentUser(
      Integer pageNumber, Integer pageSize, String sortBy, String sortDir);
}
