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
public class UserPreferencesResponseDto extends BaseResponseDto {

  private UserPreferencesDto data;

  public UserPreferencesResponseDto(
      int status, boolean success, String message, UserPreferencesDto data) {
    super(status, success, message);
    this.data = data;
  }
}
