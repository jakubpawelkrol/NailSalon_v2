package com.krol.nail.salon.controllers;

import com.krol.nail.salon.dtos.LoginRequest;
import com.krol.nail.salon.dtos.SignupRequest;
import com.krol.nail.salon.dtos.UserRequest;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.services.UserService;
import com.krol.nail.salon.services.jwt.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthenticatonController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthenticatonController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login Request: {}", loginRequest);
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
            );
            log.info("Authentication Successful");
            User user = userService.findByEmail(loginRequest.email());
            Map<String, Object> response = generateResponse(user, loginRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.info("Authentication Failed, message: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid credentials!\n"+ e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            log.info("Signup Request: {}", signupRequest);
            User user = userService.createUser(
                    signupRequest.email(),
                    signupRequest.password(),
                    signupRequest.firstName(),
                    signupRequest.lastName()
            );
            log.info("User Created: {}", user);
            Map<String, Object> response = generateResponse(user, signupRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.info("Signup Failed, message: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating user!\n"+ e.getMessage());
        }
    }

    private Map<String, Object> generateResponse(User user, UserRequest userRequest) {
        Map<String, Object> response = new HashMap<>();
        UserDetails userDetails = userService.loadUserByUsername(userRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        response.put("token", token);
        response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "roles", user.getRole()
        ));
        return response;
    }
}
