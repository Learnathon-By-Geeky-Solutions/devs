package com.devs.roamance.dto.response.social;

import com.devs.roamance.dto.response.AuditDto;
import com.devs.roamance.dto.response.user.UserDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {

  private UUID id;
  private String text;

  @JsonProperty("image_path")
  private String imagePath;

  @JsonProperty("video_path")
  private String videoPath;

  private UserDto user;

  private AuditDto audit = new AuditDto();
}
