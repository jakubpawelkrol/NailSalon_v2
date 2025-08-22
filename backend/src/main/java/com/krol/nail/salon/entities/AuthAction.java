package com.krol.nail.salon.entities;

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
        return this.action;
    }

    public static AuthAction fromString(String action) throws IllegalAccessException {
        for(AuthAction authAction : AuthAction.values()) {
            if(authAction.name().equalsIgnoreCase(action)) {
                return authAction;
            }
        }
        throw new IllegalAccessException("Value " + action + " not found");
    }

}
