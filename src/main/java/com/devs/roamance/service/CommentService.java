package com.devs.roamance.service;

import com.devs.roamance.dto.request.social.CommentRequestDto;
import com.devs.roamance.dto.response.social.CommentListResponseDto;
import com.devs.roamance.dto.response.social.CommentResponseDto;
import java.util.UUID;

public interface CommentService {

  CommentResponseDto create(CommentRequestDto requestDto, UUID postId);

  CommentResponseDto get(UUID commentId);

  CommentListResponseDto getByPostId(
      UUID postId, Integer pageNumber, Integer pageSize, String sortBy, String sortDir);
}
