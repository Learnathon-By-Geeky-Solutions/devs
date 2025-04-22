package com.devs.roamance.controller;

import com.devs.roamance.dto.request.social.CommentRequestDto;
import com.devs.roamance.dto.response.social.CommentListResponseDto;
import com.devs.roamance.dto.response.social.CommentResponseDto;
import com.devs.roamance.service.CommentService;
import com.devs.roamance.util.PaginationSortingUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentController {

  private final CommentService commentService;

  public CommentController(CommentService commentService) {

    this.commentService = commentService;
  }

  @PostMapping("/create/post/{postId}")
  public ResponseEntity<CommentResponseDto> createComment(
      @Valid @RequestBody CommentRequestDto requestDto, @PathVariable @NotNull UUID postId) {

    CommentResponseDto responseDto = commentService.create(requestDto, postId);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
  }

  @GetMapping("/{commentId}")
  public ResponseEntity<CommentResponseDto> getCommentById(@PathVariable @NotNull UUID commentId) {

    CommentResponseDto responseDto = commentService.get(commentId);

    return ResponseEntity.ok(responseDto);
  }

  @GetMapping("/by-post/{postId}")
  public ResponseEntity<CommentListResponseDto> getCommentsByPostId(
      @PathVariable @NotNull UUID postId,
      @RequestParam(defaultValue = "0") Integer pageNumber,
      @RequestParam(defaultValue = "10") Integer pageSize,
      @RequestParam(defaultValue = "audit.createdAt") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    int[] validatedParams = PaginationSortingUtil.validatePaginationParams(pageNumber, pageSize);

    CommentListResponseDto responseDto =
        commentService.getByPostId(postId, validatedParams[0], validatedParams[1], sortBy, sortDir);

    return ResponseEntity.ok(responseDto);
  }
}
