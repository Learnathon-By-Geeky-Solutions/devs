package com.devs.roamance.dto.response.travel.itinerary;

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
public class DayPlanDetailDto extends DayPlanBriefDto {

  @JsonProperty("route_plan")
  private RoutePlanResponseDto routePlan;

  private List<String> notes = new ArrayList<>();
}
