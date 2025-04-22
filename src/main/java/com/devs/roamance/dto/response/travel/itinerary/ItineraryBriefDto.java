package com.devs.roamance.dto.response.travel.itinerary;

import com.devs.roamance.dto.response.AuditDto;
import com.devs.roamance.dto.response.user.UserDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryBriefDto {

  private UUID id;
  private String title;
  private String description;

  @JsonProperty("start_date")
  private LocalDate startDate;

  @JsonProperty("end_date")
  private LocalDate endDate;

  @JsonProperty("total_cost")
  private BigDecimal totalCost;

  private UserDto user;

  private AuditDto audit = new AuditDto();
}
