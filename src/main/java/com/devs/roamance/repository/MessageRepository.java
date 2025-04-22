package com.devs.roamance.repository;

import com.devs.roamance.model.social.Message;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, UUID> {

  Page<Message> findAllByChatId(UUID chatId, Pageable pageable);
}
