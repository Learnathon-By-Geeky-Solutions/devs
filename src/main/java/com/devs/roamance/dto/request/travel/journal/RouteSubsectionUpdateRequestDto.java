package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationUpdateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteSubsectionUpdateRequestDto extends LocationUpdateRequestDto {
  @Valid private List<LocationUpdateRequestDto> locations;

  @Min(value = 1, message = "Total time must be at least 1 minute")
  private Integer totalTime;

  @Positive(message = "Total distance must be positive")
  private Double totalDistance;
}
