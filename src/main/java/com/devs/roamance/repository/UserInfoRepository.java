package com.devs.roamance.repository;

import com.devs.roamance.model.user.UserInfo;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, UUID> {
  Optional<UserInfo> findByUserId(UUID userId);
}
