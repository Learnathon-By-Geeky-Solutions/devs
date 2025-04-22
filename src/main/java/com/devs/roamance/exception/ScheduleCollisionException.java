package com.devs.roamance.exception;

import java.io.Serial;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ScheduleCollisionException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public ScheduleCollisionException(String message) {

    super(message);
  }
}
