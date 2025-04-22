package com.devs.roamance.model.user.preference;

public enum BudgetLevel {
  BUDGET("Budget"),
  ECONOMIC("Economic"),
  MODERATE("Moderate"),
  PREMIUM("Premium"),
  LUXURY("Luxury");

  private final String value;

  BudgetLevel(String value) {
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
