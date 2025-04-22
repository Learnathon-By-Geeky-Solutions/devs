package com.devs.roamance.dto.request.travel.itinerary;

import com.devs.roamance.dto.request.travel.LocationCreateRequestDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryCreateRequestDto {

  @Size(min = 1, max = 30, message = "There should be at least 1 and at most 30 locations")
  private Set<LocationCreateRequestDto> locations = new HashSet<>();

  @NotBlank(message = "Title is required")
  @Size(max = 100, message = "Title must be less than 100 characters")
  private String title;

  @Size(max = 10_000, message = "Description must be less than 10000 characters")
  private String description;

  @JsonProperty("start_date")
  @NotNull(message = "Start date is required")
  private LocalDate startDate;

  @JsonProperty("end_date")
  @NotNull(message = "End date is required")
  private LocalDate endDate;

  @Size(max = 10, message = "Maximum 10 notes allowed")
  private List<
          @NotBlank(message = "Note can not be empty")
          @Size(max = 10_000, message = "Note can not contain more than 10000 characters") String>
      notes = new ArrayList<>();
}
