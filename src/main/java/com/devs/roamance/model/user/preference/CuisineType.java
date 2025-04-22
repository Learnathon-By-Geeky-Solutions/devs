package com.devs.roamance.model.user.preference;

public enum CuisineType {
  LOCAL_CUISINE("Local Cuisine"),
  INTERNATIONAL("International"),
  FINE_DINING("Fine Dining"),
  STREET_FOOD("Street Food"),
  VEGAN("Vegan");

  private final String value;

  CuisineType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return value;
  }

  public static CuisineType fromValue(String value) {
    if (value == null) {
      return LOCAL_CUISINE;
    }

    for (CuisineType type : CuisineType.values()) {
      if (type.value.equalsIgnoreCase(value)) {
        return type;
      }
    }

    return LOCAL_CUISINE;
  }
}
