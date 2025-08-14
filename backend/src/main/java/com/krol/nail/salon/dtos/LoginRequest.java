package com.krol.nail.salon.dtos;

public record LoginRequest(String email, String password) implements UserRequest {
    @Override
    public String getEmail() {
        return email;
    }
}
