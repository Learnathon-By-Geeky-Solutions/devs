package com.devs.roamance.dto.response.travel.itinerary;

import com.devs.roamance.dto.response.BaseResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDto extends BaseResponseDto {

  private ActivityDto data;

  public ActivityResponseDto(int status, boolean success, String message, ActivityDto data) {

    super(status, success, message);
    this.data = data;
  }
}
