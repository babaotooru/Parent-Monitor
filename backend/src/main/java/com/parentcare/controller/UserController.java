package com.parentcare.controller;

import com.parentcare.model.User;
import com.parentcare.repository.UserRepository;
import com.parentcare.dto.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(409)
                    .body(Map.of("success", false, "message", "Username already exists"));
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getByRole(@PathVariable String role) {
        User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
        return ResponseEntity.ok(userRepository.findByRole(userRole));
    }

    @GetMapping("/guardian/{guardianId}/parents")
    public ResponseEntity<List<User>> getParentsByGuardian(@PathVariable Long guardianId) {
        return ResponseEntity.ok(userRepository.findByGuardianId(guardianId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFullName(userDetails.getFullName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhoneNumber(userDetails.getPhoneNumber());
                    user.setAge(userDetails.getAge());
                    user.setHealthConditions(userDetails.getHealthConditions());
                    user.setAddress(userDetails.getAddress());
                    user.setEmergencyContact1(userDetails.getEmergencyContact1());
                    user.setEmergencyContact2(userDetails.getEmergencyContact2());
                    user.setFallDetectionEnabled(userDetails.getFallDetectionEnabled());
                    user.setLocationTrackingEnabled(userDetails.getLocationTrackingEnabled());
                    user.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/last-activity")
    public ResponseEntity<User> updateLastActivity(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setLastActivity(LocalDateTime.now());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Login endpoint with detailed output
     * Feature 1: Login & Authentication Output
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Find user by username
        User user = userRepository.findByUsername(username).orElse(null);

        // Validate user exists, is active, and password matches
        // In production, use BCrypt password encoder
        if (user != null && Boolean.TRUE.equals(user.getActive()) &&
                user.getPassword() != null && user.getPassword().equals(password)) {

            // Generate session ID
            String sessionId = UUID.randomUUID().toString();

            // Update last login
            user.setLastActivity(LocalDateTime.now());
            userRepository.save(user);

            LoginResponse response = new LoginResponse(true, "Login successful", user, sessionId);
            return ResponseEntity.ok(response);
        } else {
            LoginResponse response = new LoginResponse(false, "Invalid username or password", null, null);
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * Biometric authentication endpoint
     */
    @PostMapping("/biometric-login")
    public ResponseEntity<LoginResponse> biometricLogin(@RequestBody Map<String, String> data) {
        String userId = data.get("userId");
        String biometricToken = data.get("biometricToken");

        // Mock biometric validation
        if (userId != null && biometricToken != null) {
            User user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            if (user != null) {
                String sessionId = UUID.randomUUID().toString();
                user.setLastActivity(LocalDateTime.now());
                userRepository.save(user);

                LoginResponse response = new LoginResponse(true, "Biometric authentication successful", user,
                        sessionId);
                response.setAuthMethod("Biometric");
                response.setBiometricEnabled(true);
                return ResponseEntity.ok(response);
            }
        }

        LoginResponse response = new LoginResponse(false, "Biometric authentication failed", null, null);
        return ResponseEntity.status(401).body(response);
    }
}
