package com.devs.roamance.model.user.preference;

public enum TravelStyle {
  RELAXED("Relaxed"),
  BALANCED("Balanced"),
  ADVENTUROUS("Adventurous");

  private final String value;

  TravelStyle(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return value;
  }

  public static TravelStyle fromValue(String value) {
    if (value == null) {
      return BALANCED;
    }

    for (TravelStyle style : TravelStyle.values()) {
      if (style.value.equalsIgnoreCase(value)) {
        return style;
      }
    }

    return BALANCED;
  }
}
