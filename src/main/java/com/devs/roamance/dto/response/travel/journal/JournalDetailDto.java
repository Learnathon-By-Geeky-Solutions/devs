package com.devs.roamance.dto.response.travel.journal;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalDetailDto extends JournalDto {
  @JsonProperty("subsections")
  private List<SubsectionBriefDto> subsections = new ArrayList<>();
}
