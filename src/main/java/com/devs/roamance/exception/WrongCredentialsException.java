package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class WrongCredentialsException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public WrongCredentialsException(String message) {

    super(message);
  }
}
