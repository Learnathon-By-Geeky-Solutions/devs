package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class AuthenticationFailedException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public AuthenticationFailedException(String message) {

        super(message);
    }
}