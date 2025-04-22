package com.devs.roamance.model.travel.itinerary;

import com.devs.roamance.exception.ScheduleCollisionException;
import com.devs.roamance.model.Audit;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(
    name = "day_plans",
    uniqueConstraints = @UniqueConstraint(columnNames = {"itinerary_id", "date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@EntityListeners(AuditingEntityListener.class)
public class DayPlan {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotNull private LocalDate date;

  @JsonIgnore
  @OneToMany(
      mappedBy = "dayPlan",
      fetch = FetchType.LAZY,
      cascade = {CascadeType.ALL},
      orphanRemoval = true)
  @OrderBy("startTime ASC")
  @Size(max = 50)
  private List<Activity> activities = new ArrayList<>();

  @Embedded private RoutePlan routePlan;

  @Size(max = 10)
  @ElementCollection(fetch = FetchType.LAZY)
  private List<@NotBlank @Size(max = 10_000) String> notes = new ArrayList<>();

  @Formula("(SELECT COALESCE(SUM(a.cost), 0) FROM activities a WHERE a.day_plan_id = id)")
  private BigDecimal totalCost = BigDecimal.ZERO;

  @JsonIgnore
  @ManyToOne(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
  @JoinColumn(name = "itinerary_id", referencedColumnName = "id")
  private Itinerary itinerary;

  @JsonIgnore
  @ManyToOne(
      fetch = FetchType.EAGER,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @Embedded private Audit audit = new Audit();

  public void validateNoTimeCollisions(Activity currentActivity) {

    if (currentActivity.getStartTime() == null || currentActivity.getEndTime() == null) return;

    // need to fetch activities EAGERLY with DayPlan using entity graph to avoid n+1
    // problem
    for (Activity otherActivity : activities) {

      if (currentActivity.getId().equals(otherActivity.getId())
          || otherActivity.getStartTime() == null
          || otherActivity.getEndTime() == null) continue;

      boolean startsBeforeEnd = !currentActivity.getStartTime().isAfter(otherActivity.getEndTime());
      boolean endsAfterStart = !currentActivity.getEndTime().isBefore(otherActivity.getStartTime());

      if (startsBeforeEnd && endsAfterStart) {

        throw new ScheduleCollisionException(
            "Activity schedule collision detected with start time : "
                + otherActivity.getStartTime()
                + " and end time : "
                + otherActivity.getEndTime());
      }
    }
  }
}
