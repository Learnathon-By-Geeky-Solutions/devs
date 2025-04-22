package com.devs.roamance.dto.request.social;

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
public class MessageRequestDto {

  @Size(max = 4000, message = "Message can not contain more than 4000 characters")
  private String text;

  @JsonProperty("image_paths")
  @Size(max = 20, message = "No more than 20 images are allowed per message")
  private List<String> imagePaths = new ArrayList<>();

  @JsonProperty("video_paths")
  @Size(max = 3, message = "No more than 3 videos are allowed per message")
  private List<String> videoPaths = new ArrayList<>();
}
