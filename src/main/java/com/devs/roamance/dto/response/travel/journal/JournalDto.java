package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.dto.response.AuditDto;
import com.devs.roamance.dto.response.travel.LocationResponseDto;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalDto {
  private UUID id;
  private String title;
  private LocationResponseDto destination;
  private String description;

  private AuditDto audit = new AuditDto();
}
