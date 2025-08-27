package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.AppointmentDto;
import com.krol.nail.salon.entities.Appointment;
import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.exceptions.ServiceNotFoundException;
import com.krol.nail.salon.repositories.AppointmentRepository;
import com.krol.nail.salon.repositories.ServicesRepository;
import com.krol.nail.salon.repositories.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ServicesRepository servicesRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, ServicesRepository servicesRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.servicesRepository = servicesRepository;
        this.userRepository = userRepository;
    }

    public AppointmentDto saveAppointment(AppointmentDto appointmentDto) {
        Services service = servicesRepository.findByName(appointmentDto.serviceName())
                .orElseThrow(() -> new ServiceNotFoundException("Service " + appointmentDto.serviceName() + " was not found in the database."));
        User user = userRepository.findByEmail(appointmentDto.userEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Username with email: " + appointmentDto.userEmail() + " was not found in the database."));
        Appointment appToSave = new Appointment(service, user);
        return appointmentRepository.save(appToSave);
    }
}
