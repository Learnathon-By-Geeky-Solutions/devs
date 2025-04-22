package com.devs.roamance.model.user.preference;

public enum ActivityType {
  SIGHTSEEING("Sightseeing"),
  NATURE_AND_OUTDOORS("Nature and Outdoors"),
  CULTURAL_EXPERIENCE("Cultural Experience"),
  FOOD_AND_DINING("Food & Dining"),
  ENTERTAINMENT("Entertainment");

  private final String value;

  ActivityType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return value;
  }

  public static ActivityType fromValue(String value) {
    if (value == null) {
      return SIGHTSEEING;
    }

    for (ActivityType type : ActivityType.values()) {
      if (type.value.equalsIgnoreCase(value)) {
        return type;
      }
    }

    return SIGHTSEEING;
  }
}
