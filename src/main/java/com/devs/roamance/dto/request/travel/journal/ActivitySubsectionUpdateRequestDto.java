package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationUpdateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySubsectionUpdateRequestDto extends SubsectionUpdateRequestDto {
  @Valid private LocationUpdateRequestDto location;

  @Size(max = 50, message = "Activity name must be less than 50 characters")
  private String activityName;
}
