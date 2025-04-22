package com.devs.roamance.dto.request.travel.itinerary;

import com.devs.roamance.dto.request.travel.LocationCreateRequestDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCreateRequestDto {

  @JsonProperty("day_plan_id")
  @NotNull(message = "Day plan id is required")
  private UUID dayPlanId;

  private LocationCreateRequestDto location;

  @JsonProperty("start_time")
  @NotNull(message = "Start time is required")
  private LocalTime startTime;

  @JsonProperty("end_time")
  @NotNull(message = "End time is required")
  private LocalTime endTime;

  @NotNull(message = "Activity type is required")
  private String type;

  @Size(max = 10_000, message = "Note can not contain more than 10000 character")
  private String note;

  private BigDecimal cost;
}
