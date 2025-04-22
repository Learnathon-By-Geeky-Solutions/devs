package com.devs.roamance.dto.response.social;

import com.devs.roamance.dto.response.BaseResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto extends BaseResponseDto {

  private MessageDto data;

  public MessageResponseDto(int status, boolean success, String message, MessageDto data) {

    super(status, success, message);
    this.data = data;
  }
}
