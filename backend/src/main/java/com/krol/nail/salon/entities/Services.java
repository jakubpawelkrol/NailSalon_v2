package com.krol.nail.salon.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "services")
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private ServiceCategory category;

    @Column(nullable = false, unique = true)
    private String name;

    //@Column(columnDefinition = "Service description to show on page")
    @Column(nullable = true)
    private String description;

    @Column(precision = 2, nullable = false)
    //@Column(nullable = false)
    private double price;

    //@Column(precision = 1, columnDefinition = "Duration in hours", nullable = false)
    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private boolean popular = false;

}
