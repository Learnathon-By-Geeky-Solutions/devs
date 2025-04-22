package com.devs.roamance.dto.request.social;

import com.devs.roamance.dto.request.travel.LocationCreateRequestDto;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class PostRequestDto {

  @Size(max = 10_000, message = "Post can not contain more than 10000 characters")
  private String text;

  @JsonProperty("image_paths")
  @Size(max = 50, message = "No more than 50 images are allowed per post")
  private List<String> imagePaths = new ArrayList<>();

  @JsonProperty("video_paths")
  @Size(max = 5, message = "No more than 5 videos are allowed per post")
  private List<String> videoPaths = new ArrayList<>();

  private LocationCreateRequestDto location;
}
