package com.krol.nail.salon.entities;

import lombok.Getter;

import java.util.Objects;
import java.util.stream.Stream;

@Getter
public enum ServiceCategory {
    MANI("Manicure"),
    PEDI("Pedicure"),
    PODO("Podologia");

    private final String category;

    ServiceCategory(String category) {
        this.category = category;
    }

    public static ServiceCategory of(String category) {
        return Stream.of(ServiceCategory.values())
                .filter(c -> Objects.equals(c.getCategory(), category))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Category " + category + " could not be found."));
    }
}
