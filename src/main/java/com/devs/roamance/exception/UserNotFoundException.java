package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UserNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public UserNotFoundException(String message) {

    super(message);
  }
}
