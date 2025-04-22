package com.devs.roamance.repository;

import com.devs.roamance.model.social.Chat;
import com.devs.roamance.model.user.User;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRepository extends JpaRepository<Chat, UUID> {

  @Query("SELECT c FROM Chat c WHERE :user1 MEMBER OF c.users AND :user2 MEMBER OF c.users")
  Chat findByUsers(@Param("user1") User user1, @Param("user2") User user2);

  Page<Chat> findAllByUsers_Id(UUID id, Pageable pageable);
}
