package com.devs.roamance.dto.response.travel.itinerary;

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
public class DayPlanListResponseDto extends BaseResponseDto {

  private List<DayPlanBriefDto> data = new ArrayList<>();

  public DayPlanListResponseDto(
      int status, boolean success, String message, List<DayPlanBriefDto> data) {

    super(status, success, message);
    this.data = data;
  }
}
