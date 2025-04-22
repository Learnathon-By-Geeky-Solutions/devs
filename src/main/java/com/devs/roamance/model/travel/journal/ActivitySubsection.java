package com.devs.roamance.model.travel.journal;

import com.devs.roamance.model.travel.Location;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@DiscriminatorValue("Activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySubsection extends Subsection {
  @Embedded private Location location;

  private String activityName;
}
