package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.model.travel.journal.SubsectionType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = SightseeingSubsectionCreateRequestDto.class, name = "SIGHTSEEING"),
  @JsonSubTypes.Type(value = ActivitySubsectionCreateRequestDto.class, name = "ACTIVITY"),
  @JsonSubTypes.Type(value = RouteSubsectionCreateRequestDto.class, name = "ROUTE")
})
@Getter
@Setter
public abstract class SubsectionCreateRequestDto {
  @NotBlank(message = "Subsection title is required")
  @Size(max = 100, message = "Title must be less than 100 characters")
  private String title;

  @Valid private SubsectionType type;

  @JsonProperty("journal_id")
  @NotNull(message = "Journal ID is required")
  private UUID journalId;

  @Size(max = 10, message = "Maximum 10 notes allowed")
  private List<@NotBlank(message = "Note cannot be empty") String> notes = new ArrayList<>();

  @Size(max = 10, message = "Maximum 10 checklist items allowed")
  private List<@NotBlank(message = "Checklist item cannot be empty") String> checklists =
      new ArrayList<>();
}
