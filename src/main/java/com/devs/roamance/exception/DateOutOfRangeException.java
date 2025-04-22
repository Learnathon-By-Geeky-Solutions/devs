package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class DateOutOfRangeException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public DateOutOfRangeException(String message) {

    super(message);
  }
}
