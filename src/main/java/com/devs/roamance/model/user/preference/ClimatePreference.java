package com.devs.roamance.model.user.preference;

public enum ClimatePreference {
  WARM_AND_SUNNY("Warm & Sunny"),
  COLD_AND_SNOWY("Cold & Snowy"),
  MODERATE("Moderate"),
  ANY_CLIMATE("Any Climate");

  private final String value;

  ClimatePreference(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return value;
  }
}
