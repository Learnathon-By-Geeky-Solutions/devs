package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationCreateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySubsectionCreateRequestDto extends SubsectionCreateRequestDto {
  @Valid
  @NotNull(message = "Location is required for activity")
  private LocationCreateRequestDto location;

  @NotBlank(message = "Activity name is required")
  @Size(max = 50, message = "Activity name must be less than 50 characters")
  private String activityName;
}
