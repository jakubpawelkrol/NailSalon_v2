package com.krol.nail.salon.dtos;

public record ServiceDto(String category, String name, String description, String price, Long duration, boolean popular) {
}
