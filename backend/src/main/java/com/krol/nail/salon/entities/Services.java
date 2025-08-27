package com.krol.nail.salon.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private double duration;

    @Column(nullable = false)
    private boolean popular = false;

    @Column(nullable = false)
    private Date createdAt;

    public Services(String category, String name, String description, String price, double duration, boolean popular) {
        this.category = ServiceCategory.of(category);
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.popular = popular;
        this.createdAt = new Date();
    }

}
