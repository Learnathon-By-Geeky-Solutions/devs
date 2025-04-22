package com.devs.roamance.dto.request.travel.itinerary;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
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
public class DayPlanUpdateRequestDto {

  private LocalDate date;

  @JsonProperty("route_plan")
  private RoutePlanRequestDto routePlan;

  @Size(max = 10, message = "Maximum 10 notes allowed")
  private List<
          @NotBlank(message = "Note can not be empty")
          @Size(max = 10_000, message = "Note can not contain more than 10000 characters") String>
      notes = new ArrayList<>();
}
