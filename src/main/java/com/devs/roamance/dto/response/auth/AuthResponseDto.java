package com.devs.roamance.dto.response.auth;

import com.devs.roamance.dto.response.BaseResponseDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto extends BaseResponseDto {

  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("refresh_token")
  private String refreshToken;

  public AuthResponseDto(
      int status, boolean success, String message, String accessToken, String refreshToken) {

    super(status, success, message);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
