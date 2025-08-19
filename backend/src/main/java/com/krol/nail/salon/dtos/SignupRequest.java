package com.krol.nail.salon.dtos;

import java.io.Serializable;

public record SignupRequest(String email, String password, String firstName, String lastName) implements Serializable, UserRequest {
    @Override
    public String getEmail() {
        return email;
    }
}
