package com.krol.nail.salon.services;

import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.repositories.ServicesRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicesService {
    private final ServicesRepository servicesRepository;

    public ServicesService(ServicesRepository servicesRepository) {
        this.servicesRepository = servicesRepository;
    }

    public List<Services> getAllServices() {
        return servicesRepository.getAllServicesSorted();
    }
}
