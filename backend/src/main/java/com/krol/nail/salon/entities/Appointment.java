package com.krol.nail.salon.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime appointmentStartDate;

    @Column(nullable = false)
    private LocalDateTime appointmentEndDate;

    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Appointment(Services service, User user, LocalDateTime appointmentStartDate, String notes) {
        this.service = service;
        this.user = user;
        this.appointmentStartDate = appointmentStartDate;
        calculateEndTime();
        this.notes = notes;
    }

    public void setAppointmentStartDate(LocalDateTime appointmentStartDate) {
        this.appointmentStartDate = appointmentStartDate;
        calculateEndTime();
    }

    @PrePersist
    @PreUpdate
    private void calculateEndTime() {
        if(appointmentStartDate != null && service.getDuration() > 0) {
            this.appointmentEndDate = appointmentStartDate.plusMinutes(service.getDuration());
        }
    }

}
