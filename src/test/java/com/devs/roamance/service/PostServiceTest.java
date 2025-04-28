package com.devs.roamance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.request.social.PostRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.social.PostDto;
import com.devs.roamance.dto.response.social.PostListResponseDto;
import com.devs.roamance.dto.response.social.PostResponseDto;
import com.devs.roamance.dto.response.user.UserDto;
import com.devs.roamance.dto.response.user.UserListResponseDto;
import com.devs.roamance.exception.ResourceNotFoundException;
import com.devs.roamance.exception.UnauthorizedActionException;
import com.devs.roamance.model.social.Post;
import com.devs.roamance.model.user.User;
import com.devs.roamance.repository.PostRepository;
import com.devs.roamance.repository.UserRepository;
import com.devs.roamance.service.impl.PostServiceImpl;
import com.devs.roamance.util.PostUtil;
import com.devs.roamance.util.UserUtil;
import java.util.ArrayList;
import java.util.Arrays;
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
class PostServiceTest {

  @Mock private PostRepository postRepository;

  @Mock private UserRepository userRepository;

  @Mock private PostUtil postUtil;

  @Mock private UserUtil userUtil;

  @Mock private ModelMapper modelMapper;

  private PostService postService;

  private User testUser;
  private Post testPost;
  private UUID testPostId;
  private UUID testUserId;

  @BeforeEach
  void setUp() {
    postService =
        new PostServiceImpl(postRepository, userRepository, postUtil, userUtil, modelMapper);

    // Setup test data
    testUserId = UUID.randomUUID();
    testPostId = UUID.randomUUID();

    testUser = new User();
    testUser.setId(testUserId);

    testPost = new Post();
    testPost.setId(testPostId);
    testPost.setUser(testUser);
    testPost.setText("Test Post Content");
  }

  @Test
  void create_ShouldCreateNewPost() {
    // Arrange
    PostRequestDto createRequestDto = new PostRequestDto();
    createRequestDto.setText("Test Post Content");

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(modelMapper.map(createRequestDto, Post.class)).thenReturn(testPost);
    when(postRepository.save(any(Post.class))).thenReturn(testPost);

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostResponseDto result = postService.create(createRequestDto);

    // Assert
    assertNotNull(result);
    assertEquals(postDto, result.getData());
    verify(postRepository, times(1)).save(any(Post.class));
    verify(postRepository, times(1)).flush();
    verify(postUtil, times(1)).backgroundAiAnalysis(testPost.getId(), createRequestDto);
    verify(postUtil, times(1)).addToVectorDb(testPost.getId(), createRequestDto);
  }

  @Test
  void get_ShouldReturnPost() {
    // Arrange
    when(postRepository.findById(testPostId)).thenReturn(Optional.of(testPost));

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostResponseDto result = postService.get(testPostId);

    // Assert
    assertNotNull(result);
    assertEquals(postDto, result.getData());
    verify(postRepository, times(1)).findById(testPostId);
  }

  @Test
  void get_ShouldThrowException_WhenPostNotFound() {
    // Arrange
    when(postRepository.findById(testPostId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ResourceNotFoundException.class,
        () -> postService.get(testPostId),
        String.format(ResponseMessage.POST_NOT_FOUND, testPostId));
  }

  @Test
  void getAll_ShouldReturnAllPosts() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Post> posts = new ArrayList<>();
    posts.add(testPost);
    Page<Post> postPage = new PageImpl<>(posts);

    when(postRepository.findAll(any(Pageable.class))).thenReturn(postPage);

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostListResponseDto result = postService.getAll(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(postRepository, times(1)).findAll(any(Pageable.class));
  }

  @Test
  void getByIds_ShouldReturnPostsWithSpecifiedIds() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    List<UUID> postIds = Arrays.asList(testPostId);

    List<Post> posts = new ArrayList<>();
    posts.add(testPost);
    Page<Post> postPage = new PageImpl<>(posts);

    when(postRepository.findAllByIds(any(UUID[].class), any(Pageable.class))).thenReturn(postPage);

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostListResponseDto result = postService.getByIds(postIds, pageNumber, pageSize);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(postRepository, times(1)).findAllByIds(any(UUID[].class), any(Pageable.class));
  }

  @Test
  void getByUserId_ShouldReturnUserPosts() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    List<Post> posts = new ArrayList<>();
    posts.add(testPost);
    Page<Post> postPage = new PageImpl<>(posts);

    when(postRepository.findAllByUserId(eq(testUserId), any(Pageable.class))).thenReturn(postPage);

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostListResponseDto result =
        postService.getByUserId(testUserId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(postRepository, times(1)).findAllByUserId(eq(testUserId), any(Pageable.class));
  }

  @Test
  void getSavedByCurrentUser_ShouldReturnSavedPosts() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "createdAt";
    String sortDir = "desc";

    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    List<Post> posts = new ArrayList<>();
    posts.add(testPost);
    Page<Post> postPage = new PageImpl<>(posts);

    when(postRepository.findAllBySavedBy_Id(eq(testUserId), any(Pageable.class)))
        .thenReturn(postPage);

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostListResponseDto result =
        postService.getSavedByCurrentUser(pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(postRepository, times(1)).findAllBySavedBy_Id(eq(testUserId), any(Pageable.class));
  }

  @Test
  void getUsersWhoLiked_ShouldReturnUsersWhoLikedPost() {
    // Arrange
    int pageNumber = 0;
    int pageSize = 10;
    String sortBy = "name";
    String sortDir = "asc";

    List<User> users = new ArrayList<>();
    users.add(testUser);
    Page<User> userPage = new PageImpl<>(users);

    when(userRepository.findAllByLikedPosts_Id(eq(testPostId), any(Pageable.class)))
        .thenReturn(userPage);

    UserDto userDto = new UserDto();
    when(modelMapper.map(testUser, UserDto.class)).thenReturn(userDto);

    // Act
    UserListResponseDto result =
        postService.getUsersWhoLiked(testPostId, pageNumber, pageSize, sortBy, sortDir);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getData());
    assertEquals(1, result.getData().size());
    verify(userRepository, times(1)).findAllByLikedPosts_Id(eq(testPostId), any(Pageable.class));
  }

  @Test
  void update_ShouldUpdatePost() {
    // Arrange
    PostRequestDto updateRequestDto = new PostRequestDto();
    updateRequestDto.setText("Updated Post Content");

    when(postRepository.findById(testPostId)).thenReturn(Optional.of(testPost));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.save(any(Post.class))).thenReturn(testPost);

    PostDto postDto = new PostDto();
    when(modelMapper.map(testPost, PostDto.class)).thenReturn(postDto);

    // Act
    PostResponseDto result = postService.update(updateRequestDto, testPostId);

    // Assert
    assertNotNull(result);
    assertEquals(postDto, result.getData());
    verify(postRepository, times(1)).save(any(Post.class));
    verify(postRepository, times(1)).flush();
  }

  @Test
  void update_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    PostRequestDto updateRequestDto = new PostRequestDto();

    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(postRepository.findById(testPostId)).thenReturn(Optional.of(testPost));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedActionException.class,
        () -> postService.update(updateRequestDto, testPostId),
        ResponseMessage.POST_UPDATE_ACTION_DENIED);
  }

  @Test
  void toggleSave_ShouldSavePost_WhenNotSaved() {
    // Arrange
    when(postRepository.existsById(testPostId)).thenReturn(true);
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.isSavedByUser(testPostId, testUserId)).thenReturn(false);

    // Act
    BaseResponseDto result = postService.toggleSave(testPostId);

    // Assert
    assertNotNull(result);
    verify(postRepository, times(1)).saveByUser(testPostId, testUserId);
    verify(postRepository, times(0)).unsaveByUser(testPostId, testUserId);
  }

  @Test
  void toggleSave_ShouldUnsavePost_WhenAlreadySaved() {
    // Arrange
    when(postRepository.existsById(testPostId)).thenReturn(true);
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.isSavedByUser(testPostId, testUserId)).thenReturn(true);

    // Act
    BaseResponseDto result = postService.toggleSave(testPostId);

    // Assert
    assertNotNull(result);
    verify(postRepository, times(0)).saveByUser(testPostId, testUserId);
    verify(postRepository, times(1)).unsaveByUser(testPostId, testUserId);
  }

  @Test
  void toggleLike_ShouldLikePost_WhenNotLiked() {
    // Arrange
    when(postRepository.existsById(testPostId)).thenReturn(true);
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.isLikedByUser(testPostId, testUserId)).thenReturn(false);

    // Act
    BaseResponseDto result = postService.toggleLike(testPostId);

    // Assert
    assertNotNull(result);
    verify(postRepository, times(1)).likeByUser(testPostId, testUserId);
    verify(postRepository, times(1)).incrementLikeCount(testPostId);
    verify(postRepository, times(0)).unlikeByUser(testPostId, testUserId);
    verify(postRepository, times(0)).decrementLikeCount(testPostId);
  }

  @Test
  void toggleLike_ShouldUnlikePost_WhenAlreadyLiked() {
    // Arrange
    when(postRepository.existsById(testPostId)).thenReturn(true);
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);
    when(postRepository.isLikedByUser(testPostId, testUserId)).thenReturn(true);

    // Act
    BaseResponseDto result = postService.toggleLike(testPostId);

    // Assert
    assertNotNull(result);
    verify(postRepository, times(0)).likeByUser(testPostId, testUserId);
    verify(postRepository, times(0)).incrementLikeCount(testPostId);
    verify(postRepository, times(1)).unlikeByUser(testPostId, testUserId);
    verify(postRepository, times(1)).decrementLikeCount(testPostId);
  }

  @Test
  void delete_ShouldDeletePost() {
    // Arrange
    when(postRepository.findById(testPostId)).thenReturn(Optional.of(testPost));
    when(userUtil.getAuthenticatedUser()).thenReturn(testUser);

    // Act
    BaseResponseDto result = postService.delete(testPostId);

    // Assert
    assertNotNull(result);
    verify(postRepository, times(1)).delete(testPost);
  }

  @Test
  void delete_ShouldThrowException_WhenUserUnauthorized() {
    // Arrange
    User differentUser = new User();
    differentUser.setId(UUID.randomUUID());

    when(postRepository.findById(testPostId)).thenReturn(Optional.of(testPost));
    when(userUtil.getAuthenticatedUser()).thenReturn(differentUser);

    // Act & Assert
    assertThrows(
        UnauthorizedActionException.class,
        () -> postService.delete(testPostId),
        ResponseMessage.POST_DELETE_ACTION_DENIED);
  }
}
