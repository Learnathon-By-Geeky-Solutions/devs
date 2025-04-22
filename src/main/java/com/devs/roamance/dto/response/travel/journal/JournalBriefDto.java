package com.devs.roamance.dto.response.travel.journal;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalBriefDto extends JournalDto {
  @JsonProperty("total_subsections")
  private int totalSubsections;
}
