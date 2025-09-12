package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.UserDto;
import com.krol.nail.salon.entities.Role;
import com.krol.nail.salon.entities.User;
import com.krol.nail.salon.mapper.UserMapper;
import com.krol.nail.salon.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email));
    }

    public UserDto createUser(String email, String password, String firstName, String lastName) {
        if(userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        User user = new User(email, passwordEncoder.encode(password), firstName, lastName);
        return UserMapper.toDto(userRepository.save(user));
    }

    public UserDto findByEmail(String email) {
        return UserMapper.toDto(userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + email)));
    }

    public boolean verifyAdminAccess(String email) {
        Role role = userRepository.getRoleWithEmail(email);
        boolean isAdmin = role.name().equals("ADMIN");
        log.info("isAdmin? {}", isAdmin);
        return isAdmin;
    }

    public Role getRole(String email) {
        return userRepository.getRoleWithEmail(email);
    }
}
