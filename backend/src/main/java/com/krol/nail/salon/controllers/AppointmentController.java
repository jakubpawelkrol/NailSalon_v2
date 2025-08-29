package com.krol.nail.salon.controllers;

import com.krol.nail.salon.dtos.AppointmentRequestDto;
import com.krol.nail.salon.services.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> saveAppointment(@RequestBody AppointmentRequestDto appointment) {
        log.info("Saving appointment: " + appointment.toString());
        return ResponseEntity.ok().body(appointmentService.saveAppointment(appointment));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getAppointmentById(@RequestParam UUID uuid) {
        log.info("Looking for appointment ID: " + uuid);
        return ResponseEntity.ok().body(appointmentService.getAppointment(uuid));
    }

    @GetMapping("get/all")
    public ResponseEntity<?> getAllAppointments() {
        log.info("Looking for all appointments");
        return ResponseEntity.ok().body(appointmentService.getAllAppointments());
    }
}
