package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.social.CommentRequestDto;
import com.devs.roamance.dto.response.social.CommentDto;
import com.devs.roamance.dto.response.social.CommentListResponseDto;
import com.devs.roamance.dto.response.social.CommentResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.model.social.Comment;
import com.devs.roamance.model.social.Post;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.CommentRepository;
import com.devs.roamance.repository.PostRepository;
import com.devs.roamance.service.impl.CommentServiceImpl;
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
class CommentServiceTest {

  @Mock private CommentRepository commentRepository;

  @Mock private PostRepository postRepository;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private CommentService commentService;

  private User testUser;
  private Post testPost;
  private Comment testComment;
  private UUID testPostId;
  private UUID testCommentId;
  private UUID testUserId;

  @BeforeEach
  void setUp() {
    commentService =
        new CommentServiceImpl(commentRepository, postRepository, userUtil, modelMapper);

    // Setup test data
    testUserId = UUID.randomUUID();
    testPostId = UUID.randomUUID();
    testCommentId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testPost = new Post();
    testPost.setId(testPostId);
    testPost.setUser(testUser);

    testComment = new Comment();
    testComment.setId(testCommentId);
    testComment.setPost(testPost);
    testComment.setUser(testUser);
    testComment.setText("Test comment text");
  }

  @Test
  void create_ShouldCreateNewComment() {
    // Arrange
    CommentRequestDto requestDto = new CommentRequestDto();
    requestDto.setText("Test comment text");

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.findById(testPostId)).thenReturn(Optional.of(testPost));
    when(modelMapper.map(requestDto, Comment.class)).thenReturn(testComment);
    when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

    CommentDto commentDto = new CommentDto();
    when(modelMapper.map(testComment, CommentDto.class)).thenReturn(commentDto);

    // Act
    CommentResponseDto result = commentService.create(requestDto, testPostId);

    // Assert
    assertNotNull(result);
    assertEquals(commentDto, result.getData());
    verify(postRepository, times(1)).incrementCommentCount(testPostId);
    verify(commentRepository, times(1)).save(any(Comment.class));
    verify(commentRepository, times(1)).flush();
  }

  @Test
  void create_ShouldThrowException_WhenPostNotFound() {
    // Arrange
    CommentRequestDto requestDto = new CommentRequestDto();
    requestDto.setText("Test comment text");

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.findById(testPostId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> commentService.create(requestDto, testPostId),
        String.format(ResponseMessage.POST_NOT_FOUND, testPostId));
  }

  @Test
  void get_ShouldReturnComment() {
    // Arrange
    when(commentRepository.findById(testCommentId)).thenReturn(Optional.of(testComment));

    CommentDto commentDto = new CommentDto();
    when(modelMapper.map(testComment, CommentDto.class)).thenReturn(commentDto);

    // Act
    CommentResponseDto result = commentService.get(testCommentId);

    // Assert
    assertNotNull(result);
    assertEquals(commentDto, result.getData());
    verify(commentRepository, times(1)).findById(testCommentId);
  }

  @Test
  void get_ShouldThrowException_WhenCommentNotFound() {
    // Arrange
    when(commentRepository.findById(testCommentId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> commentService.get(testCommentId),
        String.format(ResponseMessage.COMMENT_NOT_FOUND, testCommentId));
  }

  @Test
  void getByPostId_ShouldReturnComments() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    when(postRepository.existsById(testPostId)).thenReturn(true);

    List<Comment> comments = new ArrayList<>();
    comments.add(testComment);
    Page<Comment> commentPage = new PageImpl<>(comments);

    when(commentRepository.findAllByPostId(eq(testPostId), any(Pageable.class)))
        .thenReturn(commentPage);

    CommentDto commentDto = new CommentDto();
    when(modelMapper.map(testComment, CommentDto.class)).thenReturn(commentDto);

    // Act
    CommentListResponseDto result =
        commentService.getByPostId(testPostId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(commentRepository, times(1)).findAllByPostId(eq(testPostId), any(Pageable.class));
  }

  @Test
  void getByPostId_ShouldThrowException_WhenPostNotFound() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    when(postRepository.existsById(testPostId)).thenReturn(false);

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> commentService.getByPostId(testPostId, pageNumber, pageSize, sortBy, sortDir),
        String.format(ResponseMessage.POST_NOT_FOUND, testPostId));
  }
}
