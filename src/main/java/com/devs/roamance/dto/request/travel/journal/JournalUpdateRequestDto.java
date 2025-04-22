package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationUpdateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JournalUpdateRequestDto {
  @Size(min = 1, max = 100, message = "Title must be between 1-100 characters")
  private String title;

  @Valid private LocationUpdateRequestDto destination;

  @Size(max = 1000, message = "Description must be less than 1000 characters")
  private String description;

  @Valid
  @Size(max = 20, message = "Maximum 20 subsections allowed")
  private List<SubsectionUpdateRequestDto> subsections;
}
