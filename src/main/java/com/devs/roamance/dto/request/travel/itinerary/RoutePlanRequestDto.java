package com.devs.roamance.dto.request.travel.itinerary;

import com.devs.roamance.model.travel.Location;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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
public class RoutePlanRequestDto {

  @JsonProperty("total_distance")
  @Min(value = 0, message = "Total distance of the route must be greater than zero")
  private Double routeTotalDistance;

  @JsonProperty("total_time")
  @Min(value = 0, message = "Total time of the route must be greater than zero")
  private Integer routeTotalTime;

  @JsonProperty("description")
  private String routeDescription;

  @JsonProperty("locations")
  @Size(min = 1, max = 30, message = "No. of locations in a route must be between 1 and 30")
  private List<Location> routeLocations = new ArrayList<>();
}
