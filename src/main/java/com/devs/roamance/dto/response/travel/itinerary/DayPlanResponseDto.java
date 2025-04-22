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
public class DayPlanResponseDto extends BaseResponseDto {

  private DayPlanDetailDto data;

  public DayPlanResponseDto(int status, boolean success, String message, DayPlanDetailDto data) {

    super(status, success, message);
    this.data = data;
  }
}
