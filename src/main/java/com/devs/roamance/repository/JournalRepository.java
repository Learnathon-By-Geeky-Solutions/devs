package com.devs.roamance.repository;

import com.devs.roamance.model.travel.journal.Journal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalRepository extends JpaRepository<Journal, UUID> {

  @EntityGraph(attributePaths = {"subsections"})
  @NonNull
  Optional<Journal> findById(@NonNull UUID id);

  @EntityGraph(attributePaths = {"subsections"})
  @NonNull
  List<Journal> findAll();

  @EntityGraph(attributePaths = {"subsections"})
  Page<Journal> findAllByAudit_CreatedBy(UUID createdBy, Pageable pageable);
}
