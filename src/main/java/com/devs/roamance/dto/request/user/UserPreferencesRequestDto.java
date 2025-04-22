package com.devs.roamance.dto.request.user;

import com.devs.roamance.model.user.preference.AccommodationType;
import com.devs.roamance.model.user.preference.ActivityType;
import com.devs.roamance.model.user.preference.BudgetLevel;
import com.devs.roamance.model.user.preference.ClimatePreference;
import com.devs.roamance.model.user.preference.CuisineType;
import com.devs.roamance.model.user.preference.TravelStyle;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesRequestDto {
  @JsonProperty("travel_style")
  private TravelStyle travelStyle;

  @JsonProperty("accommodation_types")
  private Set<AccommodationType> accommodationTypes;

  @JsonProperty("activity_types")
  private Set<ActivityType> activityTypes;

  @JsonProperty("cuisine_types")
  private Set<CuisineType> cuisineTypes;

  @JsonProperty("climate_preference")
  private ClimatePreference climatePreference;

  @JsonProperty("budget_level")
  private BudgetLevel budgetLevel;
}
