package com.devs.roamance.repository;

import com.devs.roamance.model.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByEmail(String email);

  @Query(
      "SELECT u FROM User u "
          + "WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) "
          + "ORDER BY "
          + "CASE "
          + "   WHEN LOWER(u.name) = LOWER(:query) THEN 0 "
          + "   WHEN LOWER(u.name) LIKE LOWER(CONCAT(:query, '%')) THEN 1 "
          + "   ELSE 2 "
          + "END")
  Page<User> searchUsers(@Param("query") String query, Pageable pageable);
}
