package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UnauthorizedAccessException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public UnauthorizedAccessException(String message) {
    super(message);
  }
}
