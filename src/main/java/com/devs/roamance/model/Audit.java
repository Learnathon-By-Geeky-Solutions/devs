package com.devs.roamance.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

@Embeddable
@Getter
@Setter
public class Audit {

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  @Setter(AccessLevel.NONE)
  private OffsetDateTime createdAt;

  @LastModifiedDate
  @Column(name = "last_modified_at")
  private OffsetDateTime lastModifiedAt;

  @CreatedBy
  @Column(name = "created_by", updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID createdBy;

  @LastModifiedBy
  @Column(name = "last_modified_by")
  private UUID lastModifiedBy;
}
