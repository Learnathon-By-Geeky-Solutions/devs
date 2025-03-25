package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.dto.response.LocationResponseDto;
import java.time.ZonedDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalBriefResponseDto {
  private UUID id;
  private String title;
  private LocationResponseDto destination;
  private String description;
  private int subsectionCount;
  private ZonedDateTime lastModified;
}
