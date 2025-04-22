package com.devs.roamance.controller;

import com.devs.roamance.dto.request.social.MessageRequestDto;
import com.devs.roamance.dto.response.social.MessageListResponseDto;
import com.devs.roamance.dto.response.social.MessageResponseDto;
import com.devs.roamance.service.MessageService;
import com.devs.roamance.util.PaginationSortingUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/messages")
public class MessageController {

  private final MessageService messageService;

  public MessageController(MessageService messageService) {
    this.messageService = messageService;
  }

  @PostMapping("/create/chat/{chatId}")
  public ResponseEntity<MessageResponseDto> createMessage(
      @PathVariable @NotNull UUID chatId, @Valid @RequestBody MessageRequestDto requestDto) {

    MessageResponseDto responseDto = messageService.create(chatId, requestDto);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/chat/{chatId}")
  public ResponseEntity<MessageListResponseDto> getMessagesByChatId(
      @PathVariable @NotNull UUID chatId,
      @RequestParam(defaultValue = "0") int pageNumber,
      @RequestParam(defaultValue = "50") int pageSize,
      @RequestParam(defaultValue = "audit.createdAt") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    MessageListResponseDto responseDto =
        messageService.getByChatId(chatId, validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }
}
