package com.devs.roamance.dto.response.travel.journal;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubsectionDetailDto extends SubsectionBriefDto {
  private List<String> notes = new ArrayList<>();
  private List<String> checklists = new ArrayList<>();
}
