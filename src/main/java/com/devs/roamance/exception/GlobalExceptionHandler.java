package com.devs.roamance.exception;

import com.devs.roamance.dto.response.BaseResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<BaseResponseDto> handleUserNotFoundException(UserNotFoundException ex) {

        return new ResponseEntity<>(new BaseResponseDto(404, false, ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BaseResponseDto> handleIllegalArgumentException(IllegalArgumentException ex) {

        return new ResponseEntity<>(new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponseDto> handleGeneralException() {

        return new ResponseEntity<>(new BaseResponseDto(500, false, "Internal server error"),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}