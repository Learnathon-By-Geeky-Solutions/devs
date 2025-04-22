package com.devs.roamance.dto.response.travel.itinerary;

import com.devs.roamance.model.travel.Location;
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
public class RoutePlanResponseDto {

  @JsonProperty("total_distance")
  private Double routeTotalDistance;

  @JsonProperty("total_time")
  private Integer routeTotalTime;

  @JsonProperty("description")
  private String routeDescription;

  @JsonProperty("locations")
  private List<Location> routeLocations = new ArrayList<>();
}
