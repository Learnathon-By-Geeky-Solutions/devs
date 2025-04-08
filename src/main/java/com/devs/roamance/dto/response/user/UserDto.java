package com.devs.roamance.dto.response.user;

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
public class UserDto {

  private UUID id;

  private String name;
  private String email;

  @JsonProperty("created_at")
  private OffsetDateTime createdAt;

  @JsonProperty("last_modified")
  private OffsetDateTime lastModified;
}
