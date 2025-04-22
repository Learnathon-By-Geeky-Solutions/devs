package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationCreateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SightseeingSubsectionCreateRequestDto {
  @Valid
  @NotNull(message = "Location is required for sightseeing")
  private LocationCreateRequestDto location;
}
