package com.devs.roamance.exception;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class UserAlreadyExistException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public UserAlreadyExistException(String message) {

        super(message);
    }
}