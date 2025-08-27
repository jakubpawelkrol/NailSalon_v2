package com.krol.nail.salon.entities;

import jakarta.persistence.*;
import lombok.*;

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
    private Date creationDate;


}
