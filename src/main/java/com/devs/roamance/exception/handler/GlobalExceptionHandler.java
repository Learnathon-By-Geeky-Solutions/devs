package com.devs.roamance.exception.handler;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.ValidationErrorDto;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.ValidationErrorResponseDto;
import com.devs.roamance.exception.*;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@ControllerAdvice
@Order(2)
public class GlobalExceptionHandler {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<BaseResponseDto> handleUserNotFoundException(UserNotFoundException ex) {

    log.error("UserNotFoundException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(404, false, ex.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(UserAlreadyExistException.class)
  public ResponseEntity<BaseResponseDto> handleUserAlreadyExistException(
      UserAlreadyExistException ex) {

    log.error("UserAlreadyExistException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(409, false, ex.getMessage()), HttpStatus.CONFLICT);
  }

  @ExceptionHandler(AuthenticationFailedException.class)
  public ResponseEntity<BaseResponseDto> handleAuthenticationFailedException(
      AuthenticationFailedException ex) {

    log.error("AuthenticationFailedException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(AuthTokenNotFoundException.class)
  public ResponseEntity<BaseResponseDto> handleAuthTokenNotFoundException(
      AuthTokenNotFoundException ex) {

    log.error("AuthTokenNotFoundException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(WrongCredentialsException.class)
  public ResponseEntity<BaseResponseDto> handleWrongCredentialsException(
      WrongCredentialsException ex) {

    log.error("WrongCredentialsException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<BaseResponseDto> handleIllegalArgumentException(
      IllegalArgumentException ex) {

    log.error("IllegalArgumentException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(
            400,
            false,
            (ResponseMessage.INVALID_TOKEN_TYPE.equals(ex.getMessage())
                    || ResponseMessage.JWT_CLAIMS_EMPTY.equals(ex.getMessage()))
                ? ex.getMessage()
                : "Illegal argument!"),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ValidationErrorResponseDto> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException ex) {

    List<ValidationErrorDto> errors =
        ex.getBindingResult().getFieldErrors().stream()
            .map(error -> new ValidationErrorDto(error.getField(), error.getDefaultMessage()))
            .toList();

    log.error("MethodArgumentNotValidException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new ValidationErrorResponseDto(400, false, ResponseMessage.VALIDATION_FAILED, errors),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(HandlerMethodValidationException.class)
  public ResponseEntity<ValidationErrorResponseDto> handleHandlerMethodValidationException(
      HandlerMethodValidationException ex) {

    List<ValidationErrorDto> errors =
        ex.getAllErrors().stream()
            .map(
                error -> {
                  String fieldName = null;
                  String[] codes = error.getCodes();

                  if (codes != null && codes.length > 0) {

                    String code = codes[0];
                    String[] parts = code.split("\\.");

                    if (parts.length > 0) {
                      fieldName = parts[parts.length - 1];
                    }
                  }

                  if (fieldName == null || fieldName.isEmpty()) {
                    fieldName = "not available";
                  }

                  return new ValidationErrorDto(fieldName, error.getDefaultMessage());
                })
            .toList();

    log.error("HandlerMethodValidationException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new ValidationErrorResponseDto(400, false, ResponseMessage.VALIDATION_FAILED, errors),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ValidationErrorResponseDto> handleMethodArgumentTypeMismatchException(
      MethodArgumentTypeMismatchException ex) {

    String paramName = ex.getName();
    String requiredType =
        ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";

    String errorMessage =
        String.format("Parameter '%s' should be of type '%s'", paramName, requiredType);

    List<ValidationErrorDto> errors = List.of(new ValidationErrorDto(paramName, errorMessage));

    log.error("MethodArgumentTypeMismatchException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new ValidationErrorResponseDto(400, false, ResponseMessage.VALIDATION_FAILED, errors),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ValidationErrorResponseDto> handleConstraintViolationException(
      ConstraintViolationException ex) {

    List<ValidationErrorDto> errors =
        ex.getConstraintViolations().stream()
            .map(
                violation ->
                    new ValidationErrorDto(
                        violation.getPropertyPath().toString(), violation.getMessage()))
            .toList();

    log.error("ConstraintViolationException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new ValidationErrorResponseDto(400, false, ResponseMessage.VALIDATION_FAILED, errors),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<BaseResponseDto> handleGeneralException(Exception ex) {

    log.error("GeneralException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(500, false, "Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
