package com.devs.roamance.dto.response.validation;

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
public class ValidationErrorResponseDto extends BaseResponseDto {

  private List<ValidationErrorDto> errors = new ArrayList<>();

  public ValidationErrorResponseDto(
      int status, boolean success, String message, List<ValidationErrorDto> errors) {

    super(status, success, message);
    this.errors = errors;
  }
}
