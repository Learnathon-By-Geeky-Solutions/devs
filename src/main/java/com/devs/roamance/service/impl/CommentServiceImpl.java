package com.devs.roamance.service.impl;

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
import com.devs.roamance.service.CommentService;
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
public class CommentServiceImpl implements CommentService {

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final UserUtil userUtil;
  private final ModelMapper modelMapper;

  public CommentServiceImpl(
      CommentRepository commentRepository,
      PostRepository postRepository,
      UserUtil userUtil,
      ModelMapper modelMapper) {

    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
    this.userUtil = userUtil;
    this.modelMapper = modelMapper;
  }

  @Override
  @Transactional
  public CommentResponseDto create(CommentRequestDto requestDto, UUID postId) {

    User user = userUtil.getAuthenticatedUser();

    Post post =
        postRepository
            .findById(postId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.POST_NOT_FOUND, postId)));

    Comment comment = modelMapper.map(requestDto, Comment.class);

    comment.setUser(user);
    comment.setPost(post);

    postRepository.incrementCommentCount(postId);

    Comment savedComment = commentRepository.save(comment);
    commentRepository.flush();

    CommentDto dto = modelMapper.map(savedComment, CommentDto.class);

    return new CommentResponseDto(201, true, ResponseMessage.COMMENT_CREATE_SUCCESS, dto);
  }

  @Override
  public CommentResponseDto get(UUID commentId) {

    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        String.format(ResponseMessage.COMMENT_NOT_FOUND, commentId)));

    CommentDto dto = modelMapper.map(comment, CommentDto.class);

    return new CommentResponseDto(200, true, ResponseMessage.COMMENT_FETCH_SUCCESS, dto);
  }

  @Override
  public CommentListResponseDto getByPostId(
      UUID postId, Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {

    if (!postRepository.existsById(postId)) {
      throw new ResourceNotFoundException(String.format(ResponseMessage.POST_NOT_FOUND, postId));
    }

    Pageable pageable =
        PageRequest.of(
            pageNumber, pageSize, Sort.by(PaginationSortingUtil.getSortDirection(sortDir), sortBy));

    Page<Comment> comments = commentRepository.findAllByPostId(postId, pageable);

    List<CommentDto> dtos =
        comments.stream().map(comment -> modelMapper.map(comment, CommentDto.class)).toList();

    return new CommentListResponseDto(200, true, ResponseMessage.COMMENTS_FETCH_SUCCESS, dtos);
  }
}
