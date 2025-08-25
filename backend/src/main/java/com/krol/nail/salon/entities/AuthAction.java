package com.krol.nail.salon.entities;

import java.util.Objects;
import java.util.stream.Stream;

public enum AuthAction {
    LOGIN("Log in"),
    SIGNUP("Sign up"),
    LOGOUT("Log out"),
    VERIFY_EMAIL("Verify Email"),
    RESET_PASSWORD("Reset Password"),
    FORGOT_PASSWORD("Forgot password");

    private final String action;

    AuthAction(String action) {
        this.action = action;
    }

    public String getAction() {
        return action;
    }

    public static AuthAction of(String action) throws IllegalAccessException {
        return Stream.of(AuthAction.values())
                .filter(aa -> Objects.equals(aa.getAction(), action))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Action " + action + " could not be found."));
    }

}
