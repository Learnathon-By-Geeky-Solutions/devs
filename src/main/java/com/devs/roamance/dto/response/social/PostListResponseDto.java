package com.devs.roamance.dto.response.social;

import com.devs.roamance.dto.response.BaseResponseDto;

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
public class PostListResponseDto extends BaseResponseDto {

  private List<PostDto> data=new ArrayList<>();

  public PostListResponseDto(int status, boolean success, String message, List<PostDto> data) {

    super(status, success, message);
    this.data = data;
  }
}
