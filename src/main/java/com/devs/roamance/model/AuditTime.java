package com.devs.roamance.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.OffsetDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Embeddable
@Getter
@Setter
public class AuditTime {

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  @Setter(AccessLevel.NONE)
  private OffsetDateTime createdAt;

  @LastModifiedDate
  @Column(name = "last_modified_at")
  private OffsetDateTime lastModifiedAt;
}
