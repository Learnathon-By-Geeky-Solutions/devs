package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class AuthenticationFailedException extends RuntimeException {

    public AuthenticationFailedException(String message) {

        super(message);
    }
}