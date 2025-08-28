package com.krol.nail.salon.mapper;

import com.krol.nail.salon.dtos.AppointmentResponseDto;
import com.krol.nail.salon.entities.Appointment;

import java.time.format.DateTimeFormatter;

public class AppointmentMapper {
    public static AppointmentResponseDto entityToResponseDto(Appointment appointment) {
        return new AppointmentResponseDto(
                appointment.getId(),
                appointment.getService().getName(),
                appointment.getAppointmentStartDate().toLocalDate().format(DateTimeFormatter.ISO_DATE),
                appointment.getAppointmentStartDate().toLocalTime().format(DateTimeFormatter.ISO_TIME),
                appointment.getService().getDuration(),
                appointment.getUser().getFirstName() + ' ' + appointment.getUser().getLastName(),
                appointment.getNotes()
        );
    }
}
