package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UserAlreadyExistException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public UserAlreadyExistException(String message) {

    super(message);
  }
}
