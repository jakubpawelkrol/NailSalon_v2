package com.krol.nail.salon.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.Objects;
import java.util.stream.Stream;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum ServiceCategory {
    MANI("Manicure"),
    PEDI("Pedicure"),
    PODO("Podologia");


    private final String displayName;

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    ServiceCategory(String displayName) {
        this.displayName = displayName;
    }

    @JsonCreator
    public static ServiceCategory of(String displayName) {
        return Stream.of(ServiceCategory.values())
                .filter(c -> Objects.equals(c.getDisplayName(), displayName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Category " + displayName + " could not be found."));
    }
}
