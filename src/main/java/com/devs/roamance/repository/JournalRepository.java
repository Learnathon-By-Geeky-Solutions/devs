package com.devs.roamance.repository;

import com.devs.roamance.model.travel.journal.Journal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalRepository extends JpaRepository<Journal, UUID> {

  @Query("SELECT j FROM Journal j LEFT JOIN FETCH j.subsections WHERE j.id = :id")
  Optional<Journal> findByIdWithSubsections(@Param("id") UUID id);

  @Query("SELECT j FROM Journal j LEFT JOIN FETCH j.subsections")
  List<Journal> findAllWithSubsections();

  @Query("SELECT j FROM Journal j LEFT JOIN FETCH j.subsections WHERE j.createdBy = :createdBy")
  List<Journal> findByCreatedByWithSubsections(@Param("createdBy") UUID createdBy);

  List<Journal> findByCreatedBy(Optional<UUID> createdBy);

  Page<Journal> findAllByCreatedBy(UUID createdBy, Pageable pageable);
}
