package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.AppointmentRequestDto;
import com.krol.nail.salon.dtos.AppointmentResponseDto;
import com.krol.nail.salon.entities.Appointment;
import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.exceptions.AppointmentNotFoundException;
import com.krol.nail.salon.exceptions.ServiceNotFoundException;
import com.krol.nail.salon.mapper.AppointmentMapper;
import com.krol.nail.salon.repositories.AppointmentRepository;
import com.krol.nail.salon.repositories.ServicesRepository;
import com.krol.nail.salon.repositories.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    public AppointmentResponseDto saveAppointment(AppointmentRequestDto appointmentRequestDto) {
        Services service = servicesRepository.findByName(appointmentRequestDto.getServiceName())
                .orElseThrow(() -> new ServiceNotFoundException("Service " + appointmentRequestDto.getServiceName() + " was not found in the database."));
        User user = userRepository.findByEmail(appointmentRequestDto.getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Username with email: " + appointmentRequestDto.getUserEmail() + " was not found in the database."));

        LocalDate date = LocalDate.parse(appointmentRequestDto.getAppointmentDate(), DateTimeFormatter.ISO_DATE);
        LocalTime time = LocalTime.parse(appointmentRequestDto.getAppointmentTime(), DateTimeFormatter.ISO_TIME);

        Appointment appToSave = appointmentRepository.save(new Appointment(service, user, LocalDateTime.of(date, time), appointmentRequestDto.getNotes()));

        return new AppointmentResponseDto(
                appToSave.getId(),
                service.getName(),
                appointmentRequestDto.getAppointmentDate(),
                appointmentRequestDto.getAppointmentTime(),
                service.getDuration(),
                user.getFirstName() + ' ' + user.getLastName(),
                appToSave.getNotes()
        );
    }

    public AppointmentResponseDto getAppointment(UUID uuid) {
        return AppointmentMapper.entityToResponseDto(appointmentRepository.findById(uuid)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment with ID: " + uuid + " was not found in the database.")));
    }

    public List<AppointmentResponseDto> getAllAppointments() {
        return Optional.of(appointmentRepository.findAll())
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> new AppointmentNotFoundException("No appointments in the database!"))
                .stream()
                .map(AppointmentMapper::entityToResponseDto)
                .toList();
    }

    public List<AppointmentResponseDto> getAllAppointmentsOnCertainDay(LocalDate day) {
        return Optional.of(appointmentRepository.findByAppointmentStartDateBetween(day.atStartOfDay(), day.plusDays(1).atStartOfDay()))
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> new AppointmentNotFoundException("No appointments for the day: " + day))
                .stream()
                .map(AppointmentMapper::entityToResponseDto)
                .toList();
    }

    public List<String> getAppointmentExistenceForMonth(int year, int month) {
        LocalDateTime startDate = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endDate = LocalDate.of(year, month, 1).plusMonths(1).atStartOfDay().minusMinutes(1);

        return Optional.of(appointmentRepository.findDistinctAppointmentDatesInRange(startDate, endDate))
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> new AppointmentNotFoundException("This month does not contain appointments!"))
                .stream()
                .map(LocalDateTime::toLocalDate)
                .map(LocalDate::toString)
                .toList();
    }
}
