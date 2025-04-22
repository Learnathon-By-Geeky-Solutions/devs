package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UnauthorizedActionException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public UnauthorizedActionException(String message) {
    super(message);
  }
}
