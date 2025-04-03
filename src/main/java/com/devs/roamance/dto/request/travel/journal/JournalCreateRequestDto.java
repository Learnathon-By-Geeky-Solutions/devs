package com.devs.roamance.dto.request.travel.journal;

import com.devs.roamance.dto.request.LocationCreateRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class JournalCreateRequestDto {
  @NotBlank(message = "Title is required")
  @Size(max = 100, message = "Title must be less than 100 characters")
  private String title;

  @Valid
  @NotNull(message = "Destination is required")
  private LocationCreateRequestDto destination;

  @Size(max = 1000, message = "Description must be less than 1000 characters")
  private String description;

  @Valid
  @Size(max = 20, message = "Maximum 20 subsections allowed")
  private List<SubsectionCreateRequestDto> subsections = new ArrayList<>();
}
