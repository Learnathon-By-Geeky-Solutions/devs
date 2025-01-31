package com.devs.roamance.constant;

public final class ResponseMessage {

    private ResponseMessage() {
    }

    public static final String USER_FETCH_SUCCESS = "User fetched successfully!";
    public static final String USERS_FETCH_SUCCESS = "Users fetched successfully!";
    public static final String USER_UPDATE_SUCCESS = "User updated successfully!";
    public static final String USER_DELETE_SUCCESS = "User deleted successfully!";
    public static final String USER_NOT_FOUND_ID = "No user present with id: %d";
    public static final String USER_NOT_FOUND_EMAIL = "No user present with email: %s";
}