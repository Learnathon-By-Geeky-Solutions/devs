package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.model.travel.journal.SubsectionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = SightseeingSubsectionResponseDto.class, name = "Sightseeing"),
  @JsonSubTypes.Type(value = ActivitySubsectionResponseDto.class, name = "Activity"),
  @JsonSubTypes.Type(value = RouteSubsectionResponseDto.class, name = "Route")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class SubsectionResponseDto {
  private Long id;
  private String title;
  private SubsectionType type;
  private List<String> notes;
  private List<String> checklists;
  private ZonedDateTime createdAt;
  private ZonedDateTime lastModified;
  private long createdBy;
  private long lastModifiedBy;
}
