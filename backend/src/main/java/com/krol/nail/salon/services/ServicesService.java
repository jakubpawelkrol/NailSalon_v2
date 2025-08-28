package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.ServiceDto;
import com.krol.nail.salon.repositories.ServicesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicesService {
    private final ServicesRepository servicesRepository;

    public ServicesService(ServicesRepository servicesRepository) {
        this.servicesRepository = servicesRepository;
    }

    public List<ServiceDto> getAllServices() {
        return servicesRepository.findAllOrderedByCategory().stream()
                .map(s -> new ServiceDto(s.getCategory().getDisplayName(), s.getName(),
                        s.getDescription(), s.getPrice(), s.getDuration(), s.isPopular()))
                .toList();
    }
}
