package com.devs.roamance.dto.response.travel.journal;

import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.model.travel.journal.Subsection;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubsectionResponseDto extends BaseResponseDto {
  private Subsection data;

  public SubsectionResponseDto(Integer status, Boolean success, String message, Subsection data) {
    super(status, success, message);
    this.data = data;
  }
}
