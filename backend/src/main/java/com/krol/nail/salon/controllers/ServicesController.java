package com.krol.nail.salon.controllers;

import com.krol.nail.salon.entities.Services;
import com.krol.nail.salon.services.ServicesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200"})
@RequestMapping("/api/services")
@Slf4j
public class ServicesController {
    private final ServicesService servicesService;

    public ServicesController(ServicesService servicesService) {
        this.servicesService = servicesService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> listAllServices() {
        List<Services> list = null;
        log.info("Reading all services");
        try {
            list = servicesService.getAllServices();
            return ResponseEntity.ok().body(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching the services data: " + e.getMessage());
        }
    }
}
