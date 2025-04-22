package com.devs.roamance.repository;

import com.devs.roamance.model.travel.itinerary.DayPlan;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

public interface DayPlanRepository extends JpaRepository<DayPlan, UUID> {

  @NonNull
  @EntityGraph(attributePaths = {"notes"}) // necessary fields from detail dto
  @Query("SELECT d FROM DayPlan d WHERE d.id = :id")
  Optional<DayPlan> findById(@NonNull UUID id);

  @Query("SELECT d FROM DayPlan d WHERE d.id = :id")
  Optional<DayPlan> findByIdLite(UUID id);

  @NonNull
  @EntityGraph(attributePaths = {"activities"}) // for validating activity collisions
  @Query("SELECT d FROM DayPlan d WHERE d.id = :id")
  Optional<DayPlan> findByIdWithActivities(@Param("id") @NonNull UUID id);

  @NonNull
  @EntityGraph(attributePaths = {"notes", "itinerary"}) // notes for dto & itinerary for validation
  @Query("SELECT d FROM DayPlan d WHERE d.id = :id")
  Optional<DayPlan> findByIdWithItinerary(@Param("id") @NonNull UUID id);

  Page<DayPlan> findAllByItineraryId(UUID itineraryId, Pageable pageable);
}
