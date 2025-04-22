package com.devs.roamance.repository;

import com.devs.roamance.model.travel.itinerary.Itinerary;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {

  @NonNull
  @EntityGraph(attributePaths = {"locations", "notes"}) // necessary fields from detail dto
  Optional<Itinerary> findById(@NonNull UUID id);

  @Query("SELECT i FROM Itinerary i WHERE i.id = :id")
  Optional<Itinerary> findByIdLite(UUID id);

  Page<Itinerary> findAllByUserId(UUID userId, Pageable pageable);
}
