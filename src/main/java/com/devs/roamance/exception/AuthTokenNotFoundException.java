package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class AuthTokenNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public AuthTokenNotFoundException(String message) {

        super(message);
    }
}
