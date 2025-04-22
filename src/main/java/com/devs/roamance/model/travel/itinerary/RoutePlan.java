package com.devs.roamance.model.travel.itinerary;

import com.devs.roamance.model.travel.Location;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.OrderColumn;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoutePlan {

  @Min(0)
  private Double routeTotalDistance;

  @Min(0)
  private Integer routeTotalTime;

  private String routeDescription;

  @OrderColumn
  @Size(min = 1, max = 30)
  @ElementCollection(fetch = FetchType.EAGER)
  private List<Location> routeLocations = new ArrayList<>();
}
