package com.devs.roamance.model.user.preference;

public enum AccommodationType {
  HOTELS("Hotels"),
  RESORTS("Resorts"),
  APARTMENTS("Apartments"),
  HOSTELS("Hostels"),
  CAMPING("Camping");

  private final String value;

  AccommodationType(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return value;
  }

  public static AccommodationType fromValue(String value) {
    if (value == null) {
      return HOTELS;
    }

    for (AccommodationType type : AccommodationType.values()) {
      if (type.value.equalsIgnoreCase(value)) {
        return type;
      }
    }

    return HOTELS;
  }
}
