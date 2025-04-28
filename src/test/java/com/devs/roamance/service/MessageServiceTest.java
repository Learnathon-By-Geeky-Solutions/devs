package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
import com.devs.roamance.service.impl.MessageServiceImpl;
import com.devs.roamance.util.UserUtil;
import java.util.*;
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
class MessageServiceTest {

  @Mock private MessageRepository messageRepository;

  @Mock private ChatRepository chatRepository;

  @Mock private ModelMapper modelMapper;

  @Mock private UserUtil userUtil;

  private MessageService messageService;
  private UUID chatId;
  private UUID userId;
  private User testUser;
  private Chat testChat;
  private Message testMessage;
  private MessageDto testMessageDto;
  private MessageRequestDto testMessageRequestDto;

  @BeforeEach
  void setUp() {
    messageService =
        new MessageServiceImpl(messageRepository, chatRepository, modelMapper, userUtil);

    // Setup test data
    chatId = UUID.randomUUID();
    userId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(userId);
    testUser.setName("Test User");

    testChat = new Chat();
    testChat.setId(chatId);
    testChat.getUsers().add(testUser);

    testMessage = new Message();
    testMessage.setId(UUID.randomUUID());
    testMessage.setChat(testChat);
    testMessage.setUser(testUser);
    testMessage.setText("Hello world");

    testMessageDto = new MessageDto();
    testMessageDto.setId(testMessage.getId());
    testMessageDto.setText(testMessage.getText());

    testMessageRequestDto = new MessageRequestDto();
    testMessageRequestDto.setText("Hello world");
  }

  @Test
  void create_WithTextMessage_ShouldCreateMessage() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(chatRepository.findById(chatId)).thenReturn(Optional.of(testChat));
    when(modelMapper.map(testMessageRequestDto, Message.class)).thenReturn(testMessage);
    when(messageRepository.save(any(Message.class))).thenReturn(testMessage);
    when(modelMapper.map(testMessage, MessageDto.class)).thenReturn(testMessageDto);

    // Act
    MessageResponseDto result = messageService.create(chatId, testMessageRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());
    assertTrue(result.isSuccess());
    assertEquals(testMessageDto, result.getData());

    // Verify chat's lastText was updated
    assertEquals("Hello world", testChat.getLastText());

    // Verify repository calls
    verify(messageRepository, times(1)).save(any(Message.class));
    verify(messageRepository, times(1)).flush();
  }

  @Test
  void create_WithImageMessage_ShouldCreateMessage() {
    // Arrange
    testMessageRequestDto.setText(null);
    testMessageRequestDto.setImagePaths(Collections.singletonList("image.jpg"));

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(chatRepository.findById(chatId)).thenReturn(Optional.of(testChat));
    when(modelMapper.map(testMessageRequestDto, Message.class)).thenReturn(testMessage);
    when(messageRepository.save(any(Message.class))).thenReturn(testMessage);
    when(modelMapper.map(testMessage, MessageDto.class)).thenReturn(testMessageDto);

    // Act
    MessageResponseDto result = messageService.create(chatId, testMessageRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());
    assertTrue(result.isSuccess());

    // Verify chat's lastText was updated correctly
    assertEquals("Test User sent a photo", testChat.getLastText());
  }

  @Test
  void create_WithMultipleImagesMessage_ShouldCreateMessage() {
    // Arrange
    testMessageRequestDto.setText(null);
    testMessageRequestDto.setImagePaths(Arrays.asList("image1.jpg", "image2.jpg"));

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(chatRepository.findById(chatId)).thenReturn(Optional.of(testChat));
    when(modelMapper.map(testMessageRequestDto, Message.class)).thenReturn(testMessage);
    when(messageRepository.save(any(Message.class))).thenReturn(testMessage);
    when(modelMapper.map(testMessage, MessageDto.class)).thenReturn(testMessageDto);

    // Act
    MessageResponseDto result = messageService.create(chatId, testMessageRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(201, result.getStatus());

    // Verify chat's lastText was updated correctly for multiple images
    assertEquals("Test User sent photos", testChat.getLastText());
  }

  @Test
  void create_WithVideoMessage_ShouldCreateMessage() {
    // Arrange
    testMessageRequestDto.setText(null);
    testMessageRequestDto.setVideoPaths(Collections.singletonList("video.mp4"));

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(chatRepository.findById(chatId)).thenReturn(Optional.of(testChat));
    when(modelMapper.map(testMessageRequestDto, Message.class)).thenReturn(testMessage);
    when(messageRepository.save(any(Message.class))).thenReturn(testMessage);
    when(modelMapper.map(testMessage, MessageDto.class)).thenReturn(testMessageDto);

    // Act
    MessageResponseDto result = messageService.create(chatId, testMessageRequestDto);

    // Assert
    assertNotNull(result);

    // Verify chat's lastText was updated correctly for video
    assertEquals("Test User sent a video", testChat.getLastText());
  }

  @Test
  void create_WithInvalidChatId_ShouldThrowResourceNotFoundException() {
    // Arrange
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(chatRepository.findById(chatId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> messageService.create(chatId, testMessageRequestDto));
  }

  @Test
  void getByChatId_ShouldReturnMessageList() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Message> messages = Collections.singletonList(testMessage);
    Page<Message> messagePage = new PageImpl<>(messages);

    when(messageRepository.findAllByChatId(eq(chatId), any(Pageable.class)))
        .thenReturn(messagePage);
    when(modelMapper.map(testMessage, MessageDto.class)).thenReturn(testMessageDto);

    // Act
    MessageListResponseDto result =
        messageService.getByChatId(chatId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertEquals(200, result.getStatus());
    assertTrue(result.isSuccess());
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    assertEquals(testMessageDto, result.getData().get(0));
  }
}
