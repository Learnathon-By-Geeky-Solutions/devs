package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.model.travel.journal.SubsectionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = SightseeingSubsectionCreateRequestDto.class, name = "Sightseeing"),
  @JsonSubTypes.Type(value = ActivitySubsectionCreateRequestDto.class, name = "Activity"),
  @JsonSubTypes.Type(value = RouteSubsectionCreateRequestDto.class, name = "Route")
})
@Getter
@Setter
public abstract class SubsectionCreateRequestDto {
  @NotBlank(message = "Subsection title is required")
  @Size(max = 100, message = "Title must be less than 100 characters")
  private String title;

  @Valid private SubsectionType type;

  @Size(max = 10, message = "Maximum 10 notes allowed")
  private List<@NotBlank(message = "Note cannot be empty") String> notes;

  @Size(max = 10, message = "Maximum 10 checklist items allowed")
  private List<@NotBlank(message = "Checklist item cannot be empty") String> checklists;
}
