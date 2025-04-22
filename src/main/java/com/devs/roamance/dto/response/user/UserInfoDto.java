package com.devs.roamance.dto.response.user;

import com.devs.roamance.dto.response.AuditTimeDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
  private UUID id;
  private String phone;
  private String bio;
  private String location;
  private LocalDate birthday;

  @JsonProperty("cover_image")
  private String coverImage;

  @JsonProperty("user_id")
  private UUID userId;

  private AuditTimeDto audit = new AuditTimeDto();
}
