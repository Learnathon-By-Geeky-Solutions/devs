package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthTokenNotFoundException extends RuntimeException {

    public AuthTokenNotFoundException(String message) {

        super(message);
    }
}
