package com.devs.roamance.dto.response.user;

import com.devs.roamance.dto.response.AuditTimeDto;
import com.fasterxml.jackson.annotation.JsonProperty;
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

  @JsonProperty("profile_image")
  private String profileImage;

  private AuditTimeDto audit = new AuditTimeDto();
}
