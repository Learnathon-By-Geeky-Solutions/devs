package com.devs.roamance.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditTimeDto {

  @JsonProperty("created_at")
  private OffsetDateTime createdAt;

  @JsonProperty("last_modified_at")
  private OffsetDateTime lastModifiedAt;
}
