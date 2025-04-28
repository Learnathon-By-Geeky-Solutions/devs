package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.devs.roamance.dto.response.social.ChatDto;
import com.devs.roamance.dto.response.social.ChatListResponseDto;
import com.devs.roamance.dto.response.social.ChatResponseDto;
import com.devs.roamance.exception.UnauthorizedAccessException;
import com.devs.roamance.model.social.Chat;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.ChatRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.impl.ChatServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

  @Mock private ChatRepository chatRepository;

  @Mock private UserRepository userRepository;

  @Mock private ModelMapper modelMapper;

  @Mock private UserUtil userUtil;

  private ChatService chatService;

  private User testUser;
  private User testUser2;
  private Chat testChat;
  private UUID testUserId;
  private UUID testUser2Id;
  private UUID testChatId;

  @BeforeEach
  void setUp() {
    chatService = new ChatServiceImpl(chatRepository, userRepository, modelMapper, userUtil);

    // Setup test data
    testUserId = UUID.randomUUID();
    testUser2Id = UUID.randomUUID();
    testChatId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testUser2 = new User();
    testUser2.setId(testUser2Id);

    testChat = new Chat();
    testChat.setId(testChatId);
    testChat.getUsers().add(testUser);
    testChat.getUsers().add(testUser2);
  }

  @Test
  void create_ShouldCreateNewChat() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userRepository.findById(testUser2Id)).thenReturn(Optional.of(testUser2));
    when(chatRepository.findByUsers(testUser, testUser2)).thenReturn(null);
    when(chatRepository.save(any(Chat.class))).thenReturn(testChat);
    when(modelMapper.map(testChat, ChatDto.class)).thenReturn(new ChatDto());

    // Act
    ChatResponseDto result = chatService.create(testUser2Id);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());
    assertTrue(result.isSuccess());
    verify(chatRepository, times(1)).save(any(Chat.class));
  }

  @Test
  void create_ShouldReturnExistingChat() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(userRepository.findById(testUser2Id)).thenReturn(Optional.of(testUser2));
    when(chatRepository.findByUsers(testUser, testUser2)).thenReturn(testChat);
    when(modelMapper.map(testChat, ChatDto.class)).thenReturn(new ChatDto());

    // Act
    ChatResponseDto result = chatService.create(testUser2Id);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    verify(chatRepository, times(0)).save(any(Chat.class));
  }

  @Test
  void get_ShouldReturnChat() {
    // Arrange
    when(chatRepository.findById(testChatId)).thenReturn(Optional.of(testChat));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(testChat, ChatDto.class)).thenReturn(new ChatDto());

    // Act
    ChatResponseDto result = chatService.get(testChatId);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
  }

  @Test
  void get_ShouldThrowUnauthorizedAccessException() {
    // Arrange
    User unauthorizedUser = new User();
    unauthorizedUser.setId(UUID.randomUUID());

    when(chatRepository.findById(testChatId)).thenReturn(Optional.of(testChat));
    when(userUtil.getAuthenticatedUser()).thenReturn(unauthorizedUser);

    // Act & Assert
    assertThrows(UnauthorizedAccessException.class, () -> chatService.get(testChatId));
  }

  @Test
  void getForCurrentUser_ShouldReturnChatList() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Chat> chats = new ArrayList<>();
    chats.add(testChat);
    Page<Chat> chatPage = new PageImpl<>(chats);

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(chatRepository.findAllByUsers_Id(eq(testUserId), any(Pageable.class)))
        .thenReturn(chatPage);
    when(modelMapper.map(testChat, ChatDto.class)).thenReturn(new ChatDto());

    // Act
    ChatListResponseDto result =
        chatService.getForCurrentUser(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
  }
}
