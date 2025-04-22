package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.dto.response.travel.LocationResponseDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteSubsectionResponseDto extends SubsectionResponseDto {
  private List<LocationResponseDto> locations = new ArrayList<>();
  private Integer totalTime;

  @JsonProperty("total_distance")
  private Double totalDistance;
}
