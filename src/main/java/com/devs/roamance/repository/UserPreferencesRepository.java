package com.devs.roamance.repository;

import com.devs.roamance.model.user.preference.UserPreferences;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, UUID> {
  Optional<UserPreferences> findByUserId(UUID userId);
}
