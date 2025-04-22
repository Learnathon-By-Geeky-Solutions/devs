package com.devs.roamance.model.travel.itinerary;

import com.devs.roamance.exception.DateOutOfRangeException;
import com.devs.roamance.exception.InvalidDateTimeException;
import com.devs.roamance.model.Audit;
import com.devs.roamance.model.travel.Location;
import com.devs.roamance.model.user.User;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "itineraries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@EntityListeners(AuditingEntityListener.class)
public class Itinerary {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Size(min = 1, max = 30)
  @ElementCollection(fetch = FetchType.LAZY)
  private Set<Location> locations = new HashSet<>();

  @NotBlank
  @Size(max = 100)
  private String title;

  @Size(max = 10_000)
  private String description;

  @NotNull private LocalDate startDate;
  @NotNull private LocalDate endDate;

  @Size(max = 10)
  @ElementCollection(fetch = FetchType.LAZY)
  private List<@NotBlank @Size(max = 10_000) String> notes = new ArrayList<>();

  @Formula(
      """
      (
        SELECT COALESCE(SUM(
          (SELECT COALESCE(SUM(a.cost), 0)
           FROM activities a
           WHERE a.day_plan_id = dp.id)
        ), 0)
        FROM day_plans dp
        WHERE dp.itinerary_id = id
      )
      """)
  private BigDecimal totalCost = BigDecimal.ZERO;

  @JsonIgnore
  @ManyToOne(
      fetch = FetchType.EAGER,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @JsonIgnore
  @OneToMany(
      mappedBy = "itinerary",
      fetch = FetchType.LAZY,
      cascade = {CascadeType.ALL},
      orphanRemoval = true)
  @OrderBy("date ASC")
  private List<DayPlan> dayPlans = new ArrayList<>();

  @Embedded private Audit audit = new Audit();

  @PrePersist
  @PreUpdate
  private void validateItineraryDate() {

    if (startDate == null || endDate == null) {
      return;
    }

    if ((endDate.isAfter(startDate.plusYears(1)))) {
      throw new DateOutOfRangeException("Itinerary date range must not exceed one year");
    }

    if (endDate.isBefore(startDate)) {
      throw new InvalidDateTimeException("Start date must be before end date");
    }
  }

  public void validateDayPlanDate(DayPlan dayPlan) {

    if (startDate == null || endDate == null || dayPlan.getDate() == null) {
      return;
    }

    if (dayPlan.getDate().isBefore(startDate) || dayPlan.getDate().isAfter(endDate)) {

      throw new DateOutOfRangeException("DayPlan date must be within itinerary date range");
    }
  }
}
