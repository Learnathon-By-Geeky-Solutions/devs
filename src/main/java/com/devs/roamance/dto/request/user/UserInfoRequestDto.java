package com.devs.roamance.dto.request.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoRequestDto {

  @Pattern(regexp = "^$|^\\+?[0-9\\-\\s()]{8,20}$", message = "Phone number format is invalid")
  private String phone;

  @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
  private String bio;

  private String location;

  @JsonProperty("cover_image")
  @Pattern(
      regexp = "^$|(?i)^(https?:\\/\\/)[^\\s]{0,2083}$",
      message = "Cover image URL format is invalid")
  private String coverImage;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate birthday;
}
