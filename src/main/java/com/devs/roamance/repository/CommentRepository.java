package com.devs.roamance.repository;

import com.devs.roamance.model.social.Comment;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

  Page<Comment> findAllByPostId(UUID postId, Pageable pageable);
}
