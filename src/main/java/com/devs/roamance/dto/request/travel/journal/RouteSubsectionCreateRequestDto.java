package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationCreateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteSubsectionCreateRequestDto extends SubsectionCreateRequestDto {
  @NotEmpty(message = "At least one route location is required")
  @Valid
  private List<LocationCreateRequestDto> locations;

  @NotNull(message = "Total time is required")
  @Min(value = 1, message = "Total time must be at least 1 minute")
  private Integer totalTime;

  @NotNull(message = "Total distance is required")
  @Positive(message = "Total distance must be positive")
  private Double totalDistance;
}
