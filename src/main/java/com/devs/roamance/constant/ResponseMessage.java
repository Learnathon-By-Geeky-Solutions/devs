package com.devs.roamance.constant;

public final class ResponseMessage {

  private ResponseMessage() {}

  public static final String REGISTRATION_SUCCESS = "Registration successful.";
  public static final String LOGIN_SUCCESS = "Login successful.";
  public static final String TOKEN_REFRESH_SUCCESS = "Token refreshed successfully.";

  public static final String USER_FETCH_SUCCESS = "User fetched successfully.";
  public static final String USERS_FETCH_SUCCESS = "Users fetched successfully.";
  public static final String USER_UPDATE_SUCCESS = "User updated successfully.";
  public static final String USER_DELETE_SUCCESS = "User deleted successfully.";
  public static final String USER_NOT_FOUND_ID = "No user present with id: %s!";
  public static final String USER_NOT_FOUND_EMAIL = "No user present with email: %s!";
  public static final String USER_ALREADY_EXIST = "User already exists with email: %s!";

  public static final String AUTHENTICATION_FAILED = "Authentication failed!";
  public static final String AUTH_TOKEN_MISSING = "Authentication token is missing!";
  public static final String WRONG_CREDENTIALS = "Wrong credentials!";
  public static final String JWT_CLAIMS_EMPTY = "JWT claims string is empty!";
  public static final String INVALID_TOKEN_TYPE = "Invalid token type!";
}
