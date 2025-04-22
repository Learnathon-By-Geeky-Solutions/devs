package com.devs.roamance.repository;

import com.devs.roamance.model.travel.journal.Subsection;
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
public interface SubsectionRepository extends JpaRepository<Subsection, UUID> {

  @Override
  @EntityGraph(attributePaths = {"journal", "notes", "checklists"})
  @NonNull
  Optional<Subsection> findById(@NonNull UUID id);

  @EntityGraph(attributePaths = {"journal", "notes", "checklists"})
  List<Subsection> findByJournalId(@NonNull UUID journalId);

  @EntityGraph(attributePaths = {"journal"})
  Page<Subsection> findAllByJournalAuditCreatedBy(@NonNull UUID userId, Pageable pageable);
}
