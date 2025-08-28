package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.AppointmentRequestDto;
import com.krol.nail.salon.entities.Appointment;
import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.exceptions.ServiceNotFoundException;
import com.krol.nail.salon.repositories.AppointmentRepository;
import com.krol.nail.salon.repositories.ServicesRepository;
import com.krol.nail.salon.repositories.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

    public AppointmentRequestDto saveAppointment(AppointmentRequestDto appointmentRequestDto) {
        Services service = servicesRepository.findByName(appointmentRequestDto.getServiceName())
                .orElseThrow(() -> new ServiceNotFoundException("Service " + appointmentRequestDto.getServiceName() + " was not found in the database."));
        User user = userRepository.findByEmail(appointmentRequestDto.getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Username with email: " + appointmentRequestDto.getUserEmail() + " was not found in the database."));
        Appointment appToSave = appointmentRepository.save();
        return new AppointmentRequestDto(
                appToSave.getService().getName(),
                appToSave.getUser().getEmail(),
                appointmentRequestDto.appointmentStartDate());
    }
}
