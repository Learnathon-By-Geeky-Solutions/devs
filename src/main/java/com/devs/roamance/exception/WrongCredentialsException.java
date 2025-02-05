package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class WrongCredentialsException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public WrongCredentialsException(String message) {

        super(message);
    }
}
