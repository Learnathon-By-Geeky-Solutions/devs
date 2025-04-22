package com.devs.roamance.dto.request.travel.itinerary;

import com.devs.roamance.dto.request.travel.LocationUpdateRequestDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivityUpdateRequestDto {

  private LocationUpdateRequestDto location;

  @JsonProperty("start_time")
  private LocalTime startTime;

  @JsonProperty("end_time")
  private LocalTime endTime;

  private String type;

  @Size(max = 10_000, message = "Note can not contain more than 10000 character")
  private String note;

  private BigDecimal cost;
}
