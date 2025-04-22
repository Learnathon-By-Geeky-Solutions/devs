package com.devs.roamance.model.travel.journal;

import com.devs.roamance.model.travel.Location;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@DiscriminatorValue("Sightseeing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SightseeingSubsection extends Subsection {
  @Embedded @NonNull private Location location;
}
