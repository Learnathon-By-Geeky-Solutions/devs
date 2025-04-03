package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthTokenNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public AuthTokenNotFoundException(String message) {

    super(message);
  }
}
