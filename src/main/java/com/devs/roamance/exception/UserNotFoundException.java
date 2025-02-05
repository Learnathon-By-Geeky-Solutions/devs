package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class UserNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public UserNotFoundException(String message) {

        super(message);
    }
}
