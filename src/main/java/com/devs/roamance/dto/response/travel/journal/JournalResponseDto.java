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
public class JournalResponseDto extends BaseResponseDto {
  private JournalDetailDto data;

  public JournalResponseDto(int status, boolean success, String message, JournalDetailDto data) {
    super(status, success, message);
    this.data = data;
  }
}
