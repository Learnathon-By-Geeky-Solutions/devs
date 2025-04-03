package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthenticationFailedException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public AuthenticationFailedException(String message) {

    super(message);
  }
}
