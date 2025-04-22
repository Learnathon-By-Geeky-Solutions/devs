package com.devs.roamance.dto.response.travel.itinerary;

import com.devs.roamance.dto.response.travel.LocationResponseDto;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryDetailDto extends ItineraryBriefDto {

  private Set<LocationResponseDto> locations = new HashSet<>();

  private List<String> notes = new ArrayList<>();
}
