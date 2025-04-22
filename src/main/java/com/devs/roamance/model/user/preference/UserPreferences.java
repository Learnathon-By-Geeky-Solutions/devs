package com.devs.roamance.model.user.preference;

import com.devs.roamance.model.AuditTime;
import com.devs.roamance.model.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(name = "travel_style")
  private TravelStyle travelStyle = TravelStyle.BALANCED;

  @ElementCollection(fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(
      name = "user_accommodation_types",
      joinColumns = @JoinColumn(name = "user_preferences_id"))
  @Column(name = "accommodation_types")
  private Set<AccommodationType> accommodationTypes = new HashSet<>();

  @ElementCollection(fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(
      name = "user_activities",
      joinColumns = @JoinColumn(name = "user_preferences_id"))
  @Column(name = "activity_types")
  private Set<ActivityType> activityTypes = new HashSet<>();

  @ElementCollection(fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name = "user_cuisines", joinColumns = @JoinColumn(name = "user_preferences_id"))
  @Column(name = "cuisine_type")
  private Set<CuisineType> cuisineTypes = new HashSet<>();

  @Enumerated(EnumType.STRING)
  @Column(name = "climate_preference")
  private ClimatePreference climatePreference = ClimatePreference.ANY_CLIMATE;

  @Enumerated(EnumType.STRING)
  @Column(name = "budget_level")
  private BudgetLevel budgetLevel = BudgetLevel.MODERATE;

  @JsonIgnore
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @Embedded private AuditTime audit = new AuditTime();
}
