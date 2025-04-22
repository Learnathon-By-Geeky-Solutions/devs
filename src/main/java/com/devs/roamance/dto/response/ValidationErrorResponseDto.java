package com.devs.roamance.dto.response;

import com.devs.roamance.dto.ValidationErrorDto;
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

  private List<ValidationErrorDto> errors;

  public ValidationErrorResponseDto(
      int status, boolean success, String message, List<ValidationErrorDto> errors) {

    super(status, success, message);
    this.errors = errors;
  }
}
