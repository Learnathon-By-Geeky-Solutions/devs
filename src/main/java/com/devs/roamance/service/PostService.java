package com.devs.roamance.service;

import com.devs.roamance.dto.request.social.PostRequestDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.social.PostListResponseDto;
import com.devs.roamance.dto.response.social.PostResponseDto;
import com.devs.roamance.dto.response.user.UserListResponseDto;
import java.util.List;
import java.util.UUID;

public interface PostService
    extends BaseService<PostResponseDto, PostResponseDto, PostRequestDto, PostRequestDto, UUID> {

  PostListResponseDto getAll(int pageNumber, int pageSize, String sortBy, String sortDir);

  PostListResponseDto getByIds(List<UUID> postIds, int pageNumber, int pageSize);

  PostListResponseDto getByUserId(
      UUID userId, int pageNumber, int pageSize, String sortBy, String sortDir);

  PostListResponseDto getSavedByCurrentUser(
      int pageNumber, int pageSize, String sortBy, String sortDir);

  UserListResponseDto getUsersWhoLiked(
      UUID postId, int pageNumber, int pageSize, String sortBy, String sortDir);

  BaseResponseDto toggleSave(UUID postId);

  BaseResponseDto toggleLike(UUID postId);
}
