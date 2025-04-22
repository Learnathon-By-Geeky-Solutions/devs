package com.devs.roamance.exception.handler;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.dto.response.BaseResponseDto;
import com.devs.roamance.dto.response.validation.ValidationErrorDto;
import com.devs.roamance.dto.response.validation.ValidationErrorResponseDto;
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

  // ==================== User Related Exceptions ====================

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

  // ==================== Authentication Related Exceptions ====================

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

  @ExceptionHandler(AuthenticatedUserNotFoundException.class)
  public ResponseEntity<BaseResponseDto> handleAuthenticatedUserNotFoundException(
      AuthenticatedUserNotFoundException ex) {

    log.error("AuthenticatedUserNotFoundException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(404, false, ex.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(WrongCredentialsException.class)
  public ResponseEntity<BaseResponseDto> handleWrongCredentialsException(
      WrongCredentialsException ex) {

    log.error("WrongCredentialsException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
  }

  // ==================== Validation Related Exceptions ====================

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

  // ==================== Resource Related Exceptions ====================

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<BaseResponseDto> handleResourceNotFoundException(
      ResourceNotFoundException ex) {

    log.error("ResourceNotFoundException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(404, false, ex.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(ResourceAlreadyExistException.class)
  public ResponseEntity<BaseResponseDto> handleResourceAlreadyExistException(
      ResourceAlreadyExistException ex) {

    log.error("ResourceAlreadyExistException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(409, false, ex.getMessage()), HttpStatus.CONFLICT);
  }

  // ==================== Authorization Related Exceptions ====================

  @ExceptionHandler(UnauthorizedAccessException.class)
  public ResponseEntity<BaseResponseDto> handleUnauthorizedAccessException(
      UnauthorizedAccessException ex) {

    log.error("UnauthorizedAccessException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(403, false, ex.getMessage()), HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(UnauthorizedActionException.class)
  public ResponseEntity<BaseResponseDto> handleUnauthorizedActionException(
      UnauthorizedActionException ex) {

    log.error("UnauthorizedActionException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(403, false, ex.getMessage()), HttpStatus.FORBIDDEN);
  }

  // ==================== Subsection Related Exceptions ====================

  @ExceptionHandler(SubsectionTypeDeserializationException.class)
  public ResponseEntity<BaseResponseDto> handleSubsectionTypeDeserializationException(
      SubsectionTypeDeserializationException ex) {

    log.error("SubsectionTypeDeserializationException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  // ==================== Itinerary related Exceptions ====================

  @ExceptionHandler(DateOutOfRangeException.class)
  public ResponseEntity<BaseResponseDto> handleDateOutOfRangeException(DateOutOfRangeException ex) {

    log.error("DateOutOfRangeException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ScheduleCollisionException.class)
  public ResponseEntity<BaseResponseDto> handleScheduleCollisionException(
      ScheduleCollisionException ex) {

    log.error("ScheduleCollisionException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(InvalidDateTimeException.class)
  public ResponseEntity<BaseResponseDto> handleInvalidDateTimeException(
      InvalidDateTimeException ex) {

    log.error("InvalidDateTimeException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  // ==================== General Exceptions ====================

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<BaseResponseDto> handleIllegalArgumentException(
      IllegalArgumentException ex) {

    log.error("IllegalArgumentException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  // ==================== Fallback Exception Handler ====================

  @ExceptionHandler(Exception.class)
  public ResponseEntity<BaseResponseDto> handleGeneralException(Exception ex) {

    log.error("GeneralException: {}", ex.getMessage(), ex);

    return new ResponseEntity<>(
        new BaseResponseDto(500, false, "Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
