package com.devs.roamance.model.travel.itinerary;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ActivityType {
  SIGHTSEEING("Sightseeing"),
  DINE_OUT("Dine Out"),
  OTHER("Other");

  private final String name;

  public static ActivityType fromString(String input) {

    if (input == null) {
      return OTHER;
    }

    String trimmedInput = input.trim();

    for (ActivityType type : ActivityType.values()) {

      if (type.name().equalsIgnoreCase(trimmedInput)
          || type.getName().equalsIgnoreCase(trimmedInput)) {

        return type;
      }
    }

    return OTHER;
  }
}
