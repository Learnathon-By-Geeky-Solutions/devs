package com.devs.roamance.dto.response;

import com.devs.roamance.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto extends BaseResponseDto {

    private UserDto user;

    public UserResponseDto(int status, boolean success, String message, UserDto user) {

        super(status, success, message);
        this.user = user;
    }
}
