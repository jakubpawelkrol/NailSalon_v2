package com.krol.nail.salon.controllers;

import com.krol.nail.salon.dtos.AppointmentRequestDto;
import com.krol.nail.salon.services.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200"})
@RequestMapping("/api/appointments")
@Slf4j
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> saveAppointment(@RequestBody AppointmentRequestDto appointment, WebRequest request) {
        request.setAttribute("appointment", appointment, RequestAttributes.SCOPE_REQUEST);
        log.info("Saving appointment: " + appointment);
        return ResponseEntity.ok().body(appointmentService.saveAppointment(appointment));
    }

    @GetMapping("/getId/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable UUID uuid) {
        log.info("Looking for appointment ID: " + uuid);
        return ResponseEntity.ok().body(appointmentService.getAppointmentWithUUID(uuid));
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllAppointments() {
        log.info("Looking for all appointments");
        return ResponseEntity.ok().body(appointmentService.getAllAppointments());
    }

    @GetMapping("/getCount/{date}")
    public ResponseEntity<?> areThereAppointmentsOnDate(@PathVariable(name = "date") LocalDate date) {
        log.info("Checking if there are any appointments at all on {}", date);
        return ResponseEntity.ok().body(appointmentService.areThereAppointmentsOnDate(date));
    }

    @GetMapping("/getDate/{date}")
    public ResponseEntity<?> getAllAppointmentsOnDay(@PathVariable(name = "date") LocalDate date) {
        log.info("Looking for all appointments on {}", date);
        return ResponseEntity.ok().body(appointmentService.getAllAppointmentsOnCertainDay(date));
    }

    @GetMapping("/exists/{year}/{month}")
    public ResponseEntity<?> getAppointmentExistenceGivenMonth(@PathVariable int year, @PathVariable int month) {
        return ResponseEntity.ok().body(appointmentService.getAppointmentExistenceForMonth(year, month));
    }
}
