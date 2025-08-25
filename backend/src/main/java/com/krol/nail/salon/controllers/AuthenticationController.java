package com.krol.nail.salon.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krol.nail.salon.dtos.LoginRequest;
import com.krol.nail.salon.dtos.SignupRequest;
import com.krol.nail.salon.dtos.UserRequest;
import com.krol.nail.salon.entities.AuthAction;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.services.UserService;
import com.krol.nail.salon.services.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200"})
@Slf4j
public class AuthenticationController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public AuthenticationController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            log.info("Login Request: {}", loginRequest);
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
            );
            log.info("Authentication Successful");
            User user = userService.findByEmail(loginRequest.email());

            Map<String, Object> responseBody = generateResponse(user, loginRequest, response, AuthAction.LOGIN.getAction());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            log.info("Authentication Failed, message: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid credentials!\n"+ e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest, HttpServletResponse response) {
        try {
            log.info("Signup Request: {}", signupRequest);
            User user = userService.createUser(
                    signupRequest.email(),
                    signupRequest.password(),
                    signupRequest.firstName(),
                    signupRequest.lastName()
            );
            log.info("User Created: {}", user);
            Map<String, Object> responseBody = generateResponse(user, signupRequest, response, AuthAction.SIGNUP.getAction());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            log.info("Signup Failed, message: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating user!\n"+ e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("authToken", null);
        Cookie userCookie = new Cookie("userInfo", null);

        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        userCookie.setHttpOnly(true);
        userCookie.setPath("/");
        userCookie.setMaxAge(0);

        response.addCookie(jwtCookie);
        response.addCookie(userCookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/hello")
    public String helloworld() {
        return "Hello World!";
    }

    private Map<String, Object> generateResponse(User user, UserRequest userRequest, HttpServletResponse response, String action) throws JsonProcessingException {
        UserDetails userDetails = userService.loadUserByUsername(userRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        Map<String, Object> userMap = Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "role", user.getRole()
        );
        String userJson = objectMapper.writeValueAsString(userMap);

        Cookie jwtCookie = new Cookie("authToken", token);
        Cookie userCookie = new Cookie("userInfo", URLEncoder.encode(userJson, StandardCharsets.UTF_8));

        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);
        userCookie.setPath("/");
        userCookie.setMaxAge(24 * 60 * 60);

        response.addCookie(jwtCookie);
        response.addCookie(userCookie);

        return Map.of("message", (action + " successful"),
                "user", userMap);

    }
}
