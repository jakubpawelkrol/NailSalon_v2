package com.krol.nail.salon.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
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

    @Column(nullable = false)
    @OneToOne
    private Services service;

    @Column(nullable = false)
    @OneToOne
    private User user;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime appointmentStartDate;

    @Column(nullable = false)
    private LocalDateTime appointmentEndDate;

    private String notes;

    @Column(nullable = false)
    private Date creationDate;

    public Appointment(Services service, User user, LocalDateTime appointmentStartDate, String notes) {
        this.service = service;
        this.user = user;
        this.appointmentStartDate = appointmentStartDate;
        calculateEndTime();
        this.notes = notes;
        this.creationDate = new Date();
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
