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
public class UserListResponseDto extends BaseResponseDto {

  private List<UserDto> data = new ArrayList<>();

  public UserListResponseDto(int status, boolean success, String message, List<UserDto> data) {

    super(status, success, message);
    this.data = data;
  }
}
