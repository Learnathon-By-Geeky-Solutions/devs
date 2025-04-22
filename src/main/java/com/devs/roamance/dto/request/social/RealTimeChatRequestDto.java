package com.devs.roamance.dto.request.social;

import com.devs.roamance.dto.response.user.UserDto;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RealTimeChatRequestDto extends MessageRequestDto {

  @Null private UserDto user;
}
