package com.devs.roamance.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
  @NonNull private Double latitude;

  @NonNull private Double longitude;
}
