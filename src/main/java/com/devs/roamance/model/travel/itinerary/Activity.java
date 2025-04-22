package com.devs.roamance.model.travel.itinerary;

import com.devs.roamance.exception.InvalidDateTimeException;
import com.devs.roamance.model.Audit;
import com.devs.roamance.model.travel.Location;
import com.devs.roamance.model.user.User;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@EntityListeners(AuditingEntityListener.class)
public class Activity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Embedded private Location location;

  @NotNull private LocalTime startTime;
  @NotNull private LocalTime endTime;

  @Enumerated(EnumType.STRING)
  @NotNull
  private ActivityType type;

  private String otherTypeName; // Set only when type is OTHER otherwise null

  @Size(max = 10_000)
  private String note;

  private BigDecimal cost = BigDecimal.ZERO;

  @JsonIgnore
  @ManyToOne(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
  @JoinColumn(name = "day_plan_id", referencedColumnName = "id")
  private DayPlan dayPlan;

  @JsonIgnore
  @ManyToOne(
      fetch = FetchType.EAGER,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @PrePersist
  @PreUpdate
  private void validateActivityTime() {

    if (startTime != null && endTime != null && endTime.isBefore(startTime)) {

      throw new InvalidDateTimeException("Start time must be before end time");
    }
  }

  @Embedded private Audit audit = new Audit();
}
