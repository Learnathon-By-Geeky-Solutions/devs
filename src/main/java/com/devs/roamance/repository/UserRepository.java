package com.devs.roamance.repository;

import java.util.Optional;

import com.devs.roamance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByEmail(String email);
}