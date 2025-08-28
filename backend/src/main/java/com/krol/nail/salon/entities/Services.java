package com.krol.nail.salon.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "services")
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ServiceCategory category;

    @Column(nullable = false, unique = true)
    private String name;

    //@Column(columnDefinition = "Service description to show on page")
    @Column(nullable = true)
    private String description;

    //@Column(precision = 2, nullable = false)
    @Column(nullable = false)
    private String price;

    @Column(precision = 1, nullable = false)
    //@Column(nullable = false)
    private Long duration;

    @Column(nullable = false)
    private boolean popular = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Services(String category, String name, String description, String price, Long duration, boolean popular) {
        this.category = ServiceCategory.of(category);
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.popular = popular;
    }

}
