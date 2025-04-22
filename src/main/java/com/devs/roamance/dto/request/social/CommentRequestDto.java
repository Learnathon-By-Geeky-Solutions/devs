package com.devs.roamance.dto.request.social;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDto {

  @Size(max = 4000, message = "Comment can not contain more than 4000 characters")
  private String text;

  @JsonProperty("image_path")
  private String imagePath;

  @JsonProperty("video_path")
  private String videoPath;
}
