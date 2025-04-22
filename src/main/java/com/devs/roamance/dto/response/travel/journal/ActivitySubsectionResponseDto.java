package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.dto.response.travel.LocationResponseDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySubsectionResponseDto extends SubsectionResponseDto {
  private LocationResponseDto location;

  @JsonProperty("activity_name")
  private String activityName;
}
