package com.devs.roamance.repository;

import com.devs.roamance.model.travel.itinerary.Activity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {

  @NonNull
  @EntityGraph(
      attributePaths = {"dayPlan", "dayPlan.activities"}) // for validating activity collisions
  @Query("SELECT a FROM Activity a WHERE a.id = :id")
  Optional<Activity> findByIdWithDayPlan(@Param("id") @NonNull UUID id);

  Page<Activity> findAllByDayPlanId(UUID dayPlanId, Pageable pageable);
}
