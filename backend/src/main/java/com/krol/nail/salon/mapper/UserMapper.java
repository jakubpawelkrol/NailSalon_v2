package com.krol.nail.salon.mapper;

import com.krol.nail.salon.dtos.UserDto;
import com.krol.nail.salon.entities.User;

public class UserMapper {
    // TODO: for future: make it Mapstruct, maybe? Just to showup.

    public static User fromDto(UserDto dto) {
        return new User(dto.email(), dto.password(), dto.firstName(), dto.lastName());
    }

    public static UserDto toDto(User entity) {
        return new UserDto(entity.getFirstName(), entity.getLastName(), entity.getEmail(), entity.getPassword());
    }
}
