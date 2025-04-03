package com.devs.roamance.model.travel.journal;

import com.devs.roamance.model.Location;
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
  @Embedded @NonNull private Location location;

  @NonNull private String activityName;
}
