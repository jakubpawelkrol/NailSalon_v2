package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.AppointmentRequestDto;
import com.krol.nail.salon.dtos.AppointmentResponseDto;
import com.krol.nail.salon.entities.Appointment;
import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.exceptions.AppointmentConflictException;
import com.krol.nail.salon.exceptions.AppointmentNotFoundException;
import com.krol.nail.salon.exceptions.ServiceNotFoundException;
import com.krol.nail.salon.mapper.AppointmentMapper;
import com.krol.nail.salon.repositories.AppointmentRepository;
import com.krol.nail.salon.repositories.ServicesRepository;
import com.krol.nail.salon.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AppointmentService {
    private final byte BUFFER_MINUTES = 10;

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

        LocalDate startDate = LocalDate.parse(appointmentRequestDto.getAppointmentDate(), DateTimeFormatter.ISO_DATE);
        LocalTime startTime = LocalTime.parse(appointmentRequestDto.getAppointmentTime(), DateTimeFormatter.ISO_TIME);

        LocalDateTime startTimeWithBuffer = LocalDateTime.of(startDate, startTime.minusMinutes(BUFFER_MINUTES));
        LocalDateTime endTimeWithBuffer = LocalDateTime.of(startDate, startTime.plusMinutes(service.getDuration()).plusMinutes(BUFFER_MINUTES));

        Appointment appToSave = null;

        if(!appointmentRepository.checkIfTheNewAppointmentOverlapsExistingOne(startTimeWithBuffer, endTimeWithBuffer)) {
            appToSave = appointmentRepository.save(new Appointment(service, user, LocalDateTime.of(startDate, startTime), appointmentRequestDto.getNotes()));
        } else {
            throw new AppointmentConflictException("Appointment time <" + startTime + " - " + startTime.plusMinutes(service.getDuration()) + "> overlaps existing appointments in the database!" );
        }

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

    public AppointmentResponseDto getAppointmentWithUUID(UUID uuid) {
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
        LocalDateTime start = day.atStartOfDay();
        LocalDateTime end = day.plusDays(1).atStartOfDay().minusSeconds(1);
        return Optional.of(appointmentRepository.findByAppointmentStartDateBetween(start, end))
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> new AppointmentNotFoundException("No appointments for the day: " + day))
                .stream()
                .map(AppointmentMapper::entityToResponseDto)
                .toList();
    }

    public Set<String> getAppointmentExistenceForMonth(int year, int month) {
        LocalDateTime startDate = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endDate = LocalDate.of(year, month, 1).plusMonths(1).atStartOfDay();

        return Optional.of(appointmentRepository.findDistinctAppointmentDatesInRange(startDate, endDate))
                .filter(list -> !list.isEmpty())
                .orElse(List.of())
                .stream()
                .map(LocalDateTime::toLocalDate)
                .map(LocalDate::toString)
                .collect(Collectors.toSet());
    }

    public Long areThereAppointmentsOnDate(LocalDate date) {
        LocalDateTime startDate = date.atStartOfDay();
        LocalDateTime endDate = date.plusDays(1).atStartOfDay().minusSeconds(1);
        Long res = appointmentRepository.countByAppointmentStartDate(startDate, endDate);
        log.info("Found {} appointments on date: {}", res, date);
        return res;
    }
}
