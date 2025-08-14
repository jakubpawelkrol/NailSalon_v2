package com.krol.nail.salon.controllers;

import com.krol.nail.salon.dtos.LoginRequest;
import com.krol.nail.salon.dtos.SignupRequest;
import com.krol.nail.salon.dtos.UserRequest;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.services.UserService;
import com.krol.nail.salon.services.jwt.JwtUtil;
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
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
            );
            User user = userService.findByEmail(loginRequest.email());
            Map<String, Object> response = generateResponse(user, loginRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials!\n"+ e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            User user = userService.createUser(
                    signupRequest.email(),
                    signupRequest.password(),
                    signupRequest.firstName(),
                    signupRequest.lastName()
            );
            Map<String, Object> response = generateResponse(user, signupRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
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
                "roles", user.getRoles()
        ));
        return response;
    }
}
