package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class InvalidDateTimeException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public InvalidDateTimeException(String message) {

    super(message);
  }
}
