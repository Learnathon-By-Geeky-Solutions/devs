package com.devs.roamance.repository;

import java.util.List;
import java.util.Optional;

import com.devs.roamance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u " +
            "WHERE LOWER(u.name) LIKE LOWER(:query) " +
            "OR LOWER(u.name) LIKE LOWER(:query) || '%' " +
            "OR LOWER(u.name) LIKE '%' || LOWER(:query) || '%' " +
            "ORDER BY " +
            "CASE " +
            "   WHEN LOWER(u.name) LIKE LOWER(:query) THEN 0 " +
            "   WHEN LOWER(u.name) LIKE LOWER(:query) || '%' THEN 1 " +
            "   ELSE 2 " +
            "END")
    List<User> searchUsers(@Param("query") String query);
}