package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthenticatedUserNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public AuthenticatedUserNotFoundException(String message) {

    super(message);
  }
}
