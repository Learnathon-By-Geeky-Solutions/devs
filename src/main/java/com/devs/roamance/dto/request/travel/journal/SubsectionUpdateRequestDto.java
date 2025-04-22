package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.model.travel.journal.SubsectionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = SightseeingSubsectionUpdateRequestDto.class, name = "SIGHTSEEING"),
  @JsonSubTypes.Type(value = ActivitySubsectionUpdateRequestDto.class, name = "ACTIVITY"),
  @JsonSubTypes.Type(value = RouteSubsectionUpdateRequestDto.class, name = "ROUTE")
})
@Getter
@Setter
public abstract class SubsectionUpdateRequestDto {

  @Size(min = 1, max = 100, message = "Title must be between 1-100 characters")
  private String title;

  private SubsectionType type;

  @Size(max = 10, message = "Maximum 10 notes allowed")
  private List<@NotBlank(message = "Note cannot be empty") String> notes = new ArrayList<>();

  @Size(max = 10, message = "Maximum 10 checklist items allowed")
  private List<@NotBlank(message = "Checklist item cannot be empty") String> checklists =
      new ArrayList<>();
}
