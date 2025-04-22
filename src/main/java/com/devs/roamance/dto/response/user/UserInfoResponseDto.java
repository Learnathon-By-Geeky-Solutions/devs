package com.devs.roamance.dto.response.user;

import com.devs.roamance.dto.response.BaseResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDto extends BaseResponseDto {

  private UserInfoDto data;

  public UserInfoResponseDto(int status, boolean success, String message, UserInfoDto data) {
    super(status, success, message);
    this.data = data;
  }
}
