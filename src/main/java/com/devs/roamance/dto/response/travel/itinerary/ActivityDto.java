package com.devs.roamance.dto.response.travel.itinerary;

import com.devs.roamance.dto.response.AuditDto;
import com.devs.roamance.dto.response.travel.LocationResponseDto;
import com.devs.roamance.model.travel.itinerary.ActivityType;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class ActivityDto {

  private UUID id;
  private LocationResponseDto location;

  @JsonProperty("start_time")
  private LocalTime startTime;

  @JsonProperty("end_time")
  private LocalTime endTime;

  private ActivityType type;

  @JsonProperty("other_type_name")
  private String otherTypeName;

  private String note;
  private BigDecimal cost;

  private AuditDto audit = new AuditDto();
}
