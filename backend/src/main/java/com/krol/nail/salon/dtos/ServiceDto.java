package com.krol.nail.salon.dtos;

public record ServiceDto(String category, String name, String description, double price, String duration, boolean popular) {
}
