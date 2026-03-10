package com.parentcare.config;

import com.parentcare.model.User;
import com.parentcare.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Data Loader - Initializes database with default test users
 * This runs on application startup for H2 in-memory database
 */
@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Loading initial test data...");

        // Check if data already exists
        if (userRepository.count() > 0) {
            logger.info("Database already contains data. Skipping initialization.");
            return;
        }

        // Create Guardian User
        User guardian = new User();
        guardian.setUsername("guardian1");
        guardian.setPassword("password123"); // In production, this should be hashed
        guardian.setEmail("guardian@example.com");
        guardian.setFullName("John Guardian");
        guardian.setPhoneNumber("+1234567890");
        guardian.setRole(User.UserRole.GUARDIAN);
        guardian.setActive(true);
        guardian.setLocationTrackingEnabled(true);
        guardian.setFallDetectionEnabled(true);
        guardian.setBiometricEnabled(false);
        guardian.setCreatedAt(LocalDateTime.now());
        guardian.setLastActivity(LocalDateTime.now());
        userRepository.save(guardian);
        logger.info("Created guardian user: guardian1");

        // Create Parent (Elderly) User
        User parent = new User();
        parent.setUsername("parent1");
        parent.setPassword("password123");
        parent.setEmail("parent@example.com");
        parent.setFullName("Mary Parent");
        parent.setPhoneNumber("+1234567891");
        parent.setRole(User.UserRole.PARENT);
        parent.setActive(true);
        parent.setAge(75);
        parent.setHealthConditions("Hypertension, Diabetes");
        parent.setLocationTrackingEnabled(true);
        parent.setFallDetectionEnabled(true);
        parent.setBiometricEnabled(false);
        parent.setGuardianId(1L); // Linked to guardian1
        parent.setCreatedAt(LocalDateTime.now());
        parent.setLastActivity(LocalDateTime.now());
        userRepository.save(parent);
        logger.info("Created parent user: parent1");

        // Create Admin User
        User admin = new User();
        admin.setUsername("admin1");
        admin.setPassword("admin123");
        admin.setEmail("admin@example.com");
        admin.setFullName("Admin User");
        admin.setPhoneNumber("+1234567892");
        admin.setRole(User.UserRole.ADMIN);
        admin.setActive(true);
        admin.setLocationTrackingEnabled(false);
        admin.setFallDetectionEnabled(false);
        admin.setBiometricEnabled(false);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setLastActivity(LocalDateTime.now());
        userRepository.save(admin);
        logger.info("Created admin user: admin1");

        // Create additional test users
        User guardian2 = new User();
        guardian2.setUsername("guardian2");
        guardian2.setPassword("password123");
        guardian2.setEmail("guardian2@example.com");
        guardian2.setFullName("Sarah Guardian");
        guardian2.setPhoneNumber("+1234567893");
        guardian2.setRole(User.UserRole.GUARDIAN);
        guardian2.setActive(true);
        guardian2.setLocationTrackingEnabled(true);
        guardian2.setFallDetectionEnabled(true);
        guardian2.setBiometricEnabled(false);
        guardian2.setCreatedAt(LocalDateTime.now());
        guardian2.setLastActivity(LocalDateTime.now());
        userRepository.save(guardian2);

        User parent2 = new User();
        parent2.setUsername("parent2");
        parent2.setPassword("password123");
        parent2.setEmail("parent2@example.com");
        parent2.setFullName("Robert Senior");
        parent2.setPhoneNumber("+1234567894");
        parent2.setRole(User.UserRole.PARENT);
        parent2.setActive(true);
        parent2.setAge(80);
        parent2.setHealthConditions("Arthritis");
        parent2.setLocationTrackingEnabled(true);
        parent2.setFallDetectionEnabled(true);
        parent2.setBiometricEnabled(false);
        parent2.setGuardianId(2L); // Linked to guardian2
        parent2.setCreatedAt(LocalDateTime.now());
        parent2.setLastActivity(LocalDateTime.now());
        userRepository.save(parent2);

        logger.info("Initial data loading completed. Total users: " + userRepository.count());
    }
}
