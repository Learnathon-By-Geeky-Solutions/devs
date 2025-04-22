package com.devs.roamance.repository;

import com.devs.roamance.model.social.Post;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, UUID> {

  Page<Post> findAllByUserId(UUID userId, Pageable pageable);

  Page<Post> findAllBySavedBy_Id(UUID userId, Pageable pageable);

  @Query(
      value =
          "SELECT * FROM posts p "
              + "WHERE p.id = ANY(:ids) "
              + "ORDER BY array_position(:ids, p.id)",
      nativeQuery = true)
  Page<Post> findAllByIds(@Param("ids") UUID[] ids, Pageable pageable);

  // Saving or unsaving a post
  @Query(
      "SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END "
          + "FROM User u JOIN u.savedPosts p WHERE u.id = :userId AND p.id = :postId")
  boolean isSavedByUser(@Param("postId") UUID postId, @Param("userId") UUID userId);

  @Modifying
  @Query(
      value = "INSERT INTO post_saves (post_id, user_id) VALUES (:postId, :userId)",
      nativeQuery = true)
  void saveByUser(@Param("postId") UUID postId, @Param("userId") UUID userId);

  @Modifying
  @Query(
      value = "DELETE FROM post_saves WHERE post_id = :postId AND user_id = :userId",
      nativeQuery = true)
  void unsaveByUser(@Param("postId") UUID postId, @Param("userId") UUID userId);

  // Liking or unliking a post
  @Query(
      "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END "
          + "FROM Post p JOIN p.likedBy u WHERE p.id = :postId AND u.id = :userId")
  boolean isLikedByUser(@Param("postId") UUID postId, @Param("userId") UUID userId);

  @Modifying
  @Query(
      value = "INSERT INTO post_likes (post_id, user_id) VALUES (:postId, :userId)",
      nativeQuery = true)
  void likeByUser(@Param("postId") UUID postId, @Param("userId") UUID userId);

  @Modifying
  @Query(
      value = "DELETE FROM post_likes WHERE post_id = :postId AND user_id = :userId",
      nativeQuery = true)
  void unlikeByUser(@Param("postId") UUID postId, @Param("userId") UUID userId);

  @Modifying
  @Query(
      value = "UPDATE posts SET likes_count = likes_count + 1 WHERE id = :postId",
      nativeQuery = true)
  void incrementLikeCount(@Param("postId") UUID postId);

  @Modifying
  @Query(
      value = "UPDATE posts SET likes_count = likes_count - 1 WHERE id = :postId",
      nativeQuery = true)
  void decrementLikeCount(@Param("postId") UUID postId);

  // increment or decrementing comments count

  @Modifying
  @Query(
      value = "UPDATE posts SET comments_count = comments_count + 1 WHERE id = :postId",
      nativeQuery = true)
  void incrementCommentCount(@Param("postId") UUID postId);

  @Modifying
  @Query(
      value = "UPDATE posts SET comments_count = comments_count - 1 WHERE id = :postId",
      nativeQuery = true)
  void decrementCommentCount(@Param("postId") UUID postId);
}
