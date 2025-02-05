package com.devs.roamance.exception.handler;

import com.devs.roamance.dto.response.BaseResponseDto;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
@Order(1)
public class JwtExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<BaseResponseDto> handleExpiredJwtException() {

        log.warn("JWT has expired");

        return new ResponseEntity<>(new BaseResponseDto(401, false, "JWT has expired!"),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<BaseResponseDto> handleSignatureException() {

        log.warn("Invalid JWT signature");

        return new ResponseEntity<>(new BaseResponseDto(401, false, "Invalid JWT signature!"),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<BaseResponseDto> handleMalformedJwtException() {

        log.warn("Malformed JWT");

        return new ResponseEntity<>(new BaseResponseDto(400, false, "Malformed JWT!"),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<BaseResponseDto> handleUnsupportedJwtException() {

        log.warn("Unsupported JWT");

        return new ResponseEntity<>(new BaseResponseDto(400, false, "Unsupported JWT!"),
                HttpStatus.BAD_REQUEST);
    }
}