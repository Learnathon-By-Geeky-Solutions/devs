package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.dto.response.BaseResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubsectionResponseDto extends BaseResponseDto {
  private SubsectionResponseDetailDto data;

  public SubsectionResponseDto(
      Integer status, Boolean success, String message, SubsectionResponseDetailDto data) {
    super(status, success, message);
    this.data = data;
  }
}
