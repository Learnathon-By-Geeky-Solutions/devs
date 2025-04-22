package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ResourceAlreadyExistException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public ResourceAlreadyExistException(String message) {
    super(message);
  }
}
