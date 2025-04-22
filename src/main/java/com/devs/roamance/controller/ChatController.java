package com.devs.roamance.controller;

import com.devs.roamance.dto.response.social.ChatListResponseDto;
import com.devs.roamance.dto.response.social.ChatResponseDto;
import com.devs.roamance.service.ChatService;
import com.devs.roamance.util.PaginationSortingUtil;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chats")
public class ChatController {

  private final ChatService chatService;

  public ChatController(ChatService chatService) {

    this.chatService = chatService;
  }

  @PostMapping("/create/user/{userId}")
  public ResponseEntity<ChatResponseDto> createChat(@PathVariable @NotNull UUID userId) {

    ChatResponseDto responseDto = chatService.create(userId);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/{chatId}")
  public ResponseEntity<ChatResponseDto> getChatById(@PathVariable @NotNull UUID chatId) {

    ChatResponseDto responseDto = chatService.get(chatId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping
  public ResponseEntity<ChatListResponseDto> getChatsForCurrentUser(
      @RequestParam(defaultValue = "0") Integer pageNumber,
      @RequestParam(defaultValue = "20") Integer pageSize,
      @RequestParam(defaultValue = "audit.lastModifiedAt") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    ChatListResponseDto responseDto =
        chatService.getForCurrentUser(validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }
}
