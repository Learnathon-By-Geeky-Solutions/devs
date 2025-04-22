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
public class MessageListResponseDto extends BaseResponseDto {

  private List<MessageDto> data = new ArrayList<>();

  public MessageListResponseDto(
      int status, boolean success, String message, List<MessageDto> data) {

    super(status, success, message);
    this.data = data;
  }
}
