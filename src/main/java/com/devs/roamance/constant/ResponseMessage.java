package com.devs.roamance.constant;

public final class ResponseMessage {

  private ResponseMessage() {}

  // ==================== Registration and Login Related ====================

  public static final String REGISTRATION_SUCCESS = "Registration successful.";
  public static final String LOGIN_SUCCESS = "Login successful.";
  public static final String TOKEN_REFRESH_SUCCESS = "Token refreshed successfully.";

  // ==================== User Related ====================

  public static final String USER_FETCH_SUCCESS = "User fetched successfully.";
  public static final String USERS_FETCH_SUCCESS = "Users fetched successfully.";
  public static final String USER_UPDATE_SUCCESS = "User updated successfully.";
  public static final String USER_DELETE_SUCCESS = "User deleted successfully.";
  public static final String USER_NOT_FOUND_ID = "No user present with id: %s!";
  public static final String USER_NOT_FOUND_EMAIL = "No user present with email: %s!";
  public static final String USER_ALREADY_EXIST = "User already exists with email: %s!";

  // ==================== User Info Related ====================

  public static final String USER_INFO_FETCH_SUCCESS = "User info fetched successfully.";
  public static final String USER_INFO_CREATE_SUCCESS = "User info created successfully.";
  public static final String USER_INFO_UPDATE_SUCCESS = "User info updated successfully.";
  public static final String USER_INFO_DELETE_SUCCESS = "User info deleted successfully.";
  public static final String USER_INFO_NOT_FOUND = "No info found for user with id: %s!";

  // ==================== User Preferences Related ====================

  public static final String USER_PREFERENCES_FETCH_SUCCESS =
      "User preferences fetched successfully.";
  public static final String USER_PREFERENCES_CREATE_SUCCESS =
      "User preferences created successfully.";
  public static final String USER_PREFERENCES_UPDATE_SUCCESS =
      "User preferences updated successfully.";
  public static final String USER_PREFERENCES_DELETE_SUCCESS =
      "User preferences deleted successfully.";
  public static final String USER_PREFERENCES_NOT_FOUND =
      "No preferences found for user with id: %s!";
  public static final String USER_PREFERENCES_ALREADY_EXIST =
      "User preferences already exist for user with id: %s!";
  public static final String USER_PREFERENCES_ACCESS_DENIED =
      "You don't have permission to access this user's preferences!";

  // ==================== Authentication Related ====================

  public static final String AUTHENTICATION_FAILED = "Authentication failed!";
  public static final String AUTH_TOKEN_MISSING = "Authentication token is missing!";
  public static final String WRONG_CREDENTIALS = "Wrong credentials!";
  public static final String JWT_CLAIMS_EMPTY = "JWT claims string is empty!";
  public static final String INVALID_TOKEN_TYPE = "Invalid token type!";

  // ==================== Validation Related ====================

  public static final String VALIDATION_FAILED = "Validation failed!";

  // ==================== Journal Related ====================

  public static final String JOURNAL_CREATE_SUCCESS = "Journal created successfully.";
  public static final String JOURNAL_FETCH_SUCCESS = "Journal fetched successfully.";
  public static final String JOURNALS_FETCH_SUCCESS = "Journals fetched successfully.";
  public static final String JOURNAL_UPDATE_SUCCESS = "Journal updated successfully.";
  public static final String JOURNAL_DELETE_SUCCESS = "Journal deleted successfully.";
  public static final String JOURNAL_NOT_FOUND = "No journal present with id: %s!";
  public static final String JOURNAL_ACCESS_DENIED =
      "You don't have permission to access this journal!";
  public static final String JOURNAL_ALREADY_EXIST = "Journal already exists with title: %s!";

  // ==================== Subsection Related ====================

  public static final String SUBSECTION_CREATE_SUCCESS = "Subsection created successfully.";
  public static final String SUBSECTION_FETCH_SUCCESS = "Subsection fetched successfully.";
  public static final String SUBSECTIONS_FETCH_SUCCESS = "Subsections fetched successfully.";
  public static final String SUBSECTION_UPDATE_SUCCESS = "Subsection updated successfully.";
  public static final String SUBSECTION_DELETE_SUCCESS = "Subsection deleted successfully.";
  public static final String SUBSECTION_NOT_FOUND = "No subsection present with id: %s!";

  // ======================== Post Related ========================

  public static final String POST_CREATE_SUCCESS = "Post created successfully.";
  public static final String POST_FETCH_SUCCESS = "Post fetched successfully.";
  public static final String POSTS_FETCH_SUCCESS = "Posts fetched successfully.";
  public static final String POST_SAVE_SUCCESS = "Post saved successfully.";
  public static final String POST_UNSAVE_SUCCESS = "Post unsaved successfully.";
  public static final String POST_LIKE_SUCCESS = "Post liked successfully.";
  public static final String POST_UNLIKE_SUCCESS = "Post unliked successfully.";
  public static final String POST_UPDATE_SUCCESS = "Post updated successfully.";
  public static final String POST_DELETE_SUCCESS = "Post deleted successfully.";
  public static final String POST_NOT_FOUND = "No post present with id: %s!";
  public static final String POST_UPDATE_ACTION_DENIED =
      "You don't have permission to update this post!";
  public static final String POST_DELETE_ACTION_DENIED =
      "You don't have permission to delete this post!";

  // ======================== Comment Related ========================

  public static final String COMMENT_CREATE_SUCCESS = "Comment created successfully.";
  public static final String COMMENT_FETCH_SUCCESS = "Comment fetched successfully.";
  public static final String COMMENTS_FETCH_SUCCESS = "Comments fetched successfully.";
  public static final String COMMENT_NOT_FOUND = "No comment present with id: %s!";

  // ========================== Chat Related ==========================

  public static final String CHAT_CREATE_SUCCESS = "Chat created successfully.";
  public static final String CHAT_FETCH_SUCCESS = "Chat fetched successfully.";
  public static final String CHATS_FETCH_SUCCESS = "Chats fetched successfully.";
  public static final String CHAT_ALREADY_EXIST = "Chat already exists!";
  public static final String CHAT_NOT_FOUND = "No chat present with id: %s!";
  public static final String CHAT_ACCESS_DENIED = "You don't have permission to access this chat!";

  // ========================== Message Related ==========================

  public static final String MESSAGE_CREATE_SUCCESS = "Message created successfully.";
  public static final String MESSAGES_FETCH_SUCCESS = "Messages fetched successfully.";

  // ========================== Itinerary Related ==========================

  public static final String ITINERARY_CREATE_SUCCESS = "Itinerary created successfully.";
  public static final String ITINERARY_FETCH_SUCCESS = "Itinerary fetched successfully.";
  public static final String ITINERARIES_FETCH_SUCCESS = "Itineraries fetched successfully.";
  public static final String ITINERARY_UPDATE_SUCCESS = "Itinerary updated successfully.";
  public static final String ITINERARY_DELETE_SUCCESS = "Itinerary deleted successfully.";
  public static final String ITINERARY_NOT_FOUND = "No itinerary present with id: %s!";
  public static final String ITINERARY_UPDATE_ACTION_DENIED =
      "You don't have permission to update this itinerary!";
  public static final String ITINERARY_DELETE_ACTION_DENIED =
      "You don't have permission to delete this itinerary!";

  // ========================== DayPlan Related ==========================

  public static final String DAY_PLAN_CREATE_SUCCESS = "Day plan created successfully.";
  public static final String DAY_PLAN_FETCH_SUCCESS = "Day plan fetched successfully.";
  public static final String DAY_PLANS_FETCH_SUCCESS = "Day plans fetched successfully.";
  public static final String DAY_PLAN_UPDATE_SUCCESS = "Day plan updated successfully.";
  public static final String DAY_PLAN_DELETE_SUCCESS = "Day plan deleted successfully.";
  public static final String DAY_PLAN_NOT_FOUND = "No Day plan present with id: %s!";
  public static final String DAY_PLAN_UPDATE_ACTION_DENIED =
      "You don't have permission to update this Day Plan!";
  public static final String DAY_PLAN_DELETE_ACTION_DENIED =
      "You don't have permission to delete this Day Plan!";
  public static final String DAY_PLAN_ALREADY_EXIST = "Day plan already exists with date: %s!";

  // ========================== Activity Related ==========================

  public static final String ACTIVITY_CREATE_SUCCESS = "Activity created successfully.";
  public static final String ACTIVITY_FETCH_SUCCESS = "Activity fetched successfully.";
  public static final String ACTIVITIES_FETCH_SUCCESS = "Activities fetched successfully.";
  public static final String ACTIVITY_UPDATE_SUCCESS = "Activity updated successfully.";
  public static final String ACTIVITY_DELETE_SUCCESS = "Activity deleted successfully.";
  public static final String ACTIVITY_NOT_FOUND = "No activity present with id: %s!";
  public static final String ACTIVITY_UPDATE_ACTION_DENIED =
      "You don't have permission to update this Activity!";
  public static final String ACTIVITY_DELETE_ACTION_DENIED =
      "You don't have permission to delete this Activity!";
}
