package com.devs.roamance.dto.response.user;

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
public class UserPreferencesListResponseDto extends BaseResponseDto {

  private List<UserPreferencesDto> data = new ArrayList<>();

  public UserPreferencesListResponseDto(
      int status, boolean success, String message, List<UserPreferencesDto> data) {
    super(status, success, message);
    this.data = data;
  }
}
