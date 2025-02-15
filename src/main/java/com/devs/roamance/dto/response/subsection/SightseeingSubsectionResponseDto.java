package com.devs.roamance.dto.response.subsection;

import com.devs.roamance.dto.response.LocationResponseDto;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SightseeingSubsectionResponseDto extends SubsectionResponseDto {
    private LocationResponseDto location;
}
