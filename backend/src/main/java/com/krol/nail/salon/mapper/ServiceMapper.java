package com.krol.nail.salon.mapper;

import com.krol.nail.salon.dtos.ServiceDto;
import com.krol.nail.salon.dtos.UserDto;
import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.entities.User;

public class ServiceMapper {
    public static Services fromDto(ServiceDto dto) {
        return new Services(dto.category(),
                dto.name(),
                dto.description(),
                dto.price(),
                dto.duration(),
                dto.popular());
    }

    public static ServiceDto toDto(Services entity) {
        return new ServiceDto(entity.getCategory().getDisplayName(),
                entity.getName(),
                entity.getDescription(),
                entity.getPrice(),
                entity.getDuration(),
                entity.isPopular());
    }
}
