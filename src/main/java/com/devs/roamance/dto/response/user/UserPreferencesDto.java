package com.devs.roamance.dto.response.user;

import com.devs.roamance.dto.response.AuditTimeDto;
import com.devs.roamance.model.user.preference.AccommodationType;
import com.devs.roamance.model.user.preference.ActivityType;
import com.devs.roamance.model.user.preference.BudgetLevel;
import com.devs.roamance.model.user.preference.ClimatePreference;
import com.devs.roamance.model.user.preference.CuisineType;
import com.devs.roamance.model.user.preference.TravelStyle;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesDto {
  private UUID id;

  @JsonProperty("travel_style")
  private TravelStyle travelStyle;

  @JsonProperty("activity_types")
  private Set<ActivityType> activityTypes;

  @JsonProperty("accommodation_types")
  private Set<AccommodationType> accommodationTypes;

  @JsonProperty("cuisine_types")
  private Set<CuisineType> cuisineTypes;

  @JsonProperty("user_id")
  private UUID userId;

  @JsonProperty("budget_level")
  private BudgetLevel budgetLevel;

  @JsonProperty("climate_preference")
  private ClimatePreference climatePreference;

  private AuditTimeDto audit = new AuditTimeDto();
}
