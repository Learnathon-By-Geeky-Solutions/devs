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
public class ItineraryResponseDto extends BaseResponseDto {

  private ItineraryDetailDto data;

  public ItineraryResponseDto(
      int status, boolean success, String message, ItineraryDetailDto data) {

    super(status, success, message);
    this.data = data;
  }
}
