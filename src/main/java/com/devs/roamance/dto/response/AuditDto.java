package com.devs.roamance.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditDto extends AuditTimeDto {

  @JsonProperty("created_at")
  private OffsetDateTime createdAt;

  @JsonProperty("last_modified_at")
  private OffsetDateTime lastModifiedAt;

  @JsonProperty("created_by")
  private UUID createdBy;

  @JsonProperty("last_modified_by")
  private UUID lastModifiedBy;
}
