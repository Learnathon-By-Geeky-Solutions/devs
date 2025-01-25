package com.devs.roamance.dto.response;

import java.util.List;

import com.devs.roamance.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponseDto extends BaseResponseDto {

    private List<UserDto> users;

    public UserListResponseDto(int status, boolean success, String message, List<UserDto> users) {
        super(status, success, message);
        this.users = users;
    }
}
