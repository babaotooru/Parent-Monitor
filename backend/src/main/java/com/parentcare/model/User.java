package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserRole role; // PARENT, GUARDIAN, ADMIN

    private Integer age;
    private String healthConditions;
    private Long guardianId; // reference to guardian

    // Profile Information
    private String fullName;
    private String profilePicture;
    private String address;
    private String emergencyContact1;
    private String emergencyContact2;

    // Routine Information (AI Learning)
    private LocalTime usualWakeTime;
    private LocalTime usualSleepTime;
    private LocalTime usualWalkTime;
    private String routinePattern; // JSON string of learned patterns

    // Safety & Monitoring Settings
    private Boolean fallDetectionEnabled;
    private Boolean locationTrackingEnabled;
    private Boolean biometricEnabled;
    private Double safetyScore; // Daily safety score (0-100)

    // Status
    private Boolean active;
    private LocalDateTime lastActivity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum UserRole {
        PARENT, GUARDIAN, ADMIN
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getHealthConditions() {
        return healthConditions;
    }

    public void setHealthConditions(String healthConditions) {
        this.healthConditions = healthConditions;
    }

    public Long getGuardianId() {
        return guardianId;
    }

    public void setGuardianId(Long guardianId) {
        this.guardianId = guardianId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmergencyContact1() {
        return emergencyContact1;
    }

    public void setEmergencyContact1(String emergencyContact1) {
        this.emergencyContact1 = emergencyContact1;
    }

    public String getEmergencyContact2() {
        return emergencyContact2;
    }

    public void setEmergencyContact2(String emergencyContact2) {
        this.emergencyContact2 = emergencyContact2;
    }

    public LocalTime getUsualWakeTime() {
        return usualWakeTime;
    }

    public void setUsualWakeTime(LocalTime usualWakeTime) {
        this.usualWakeTime = usualWakeTime;
    }

    public LocalTime getUsualSleepTime() {
        return usualSleepTime;
    }

    public void setUsualSleepTime(LocalTime usualSleepTime) {
        this.usualSleepTime = usualSleepTime;
    }

    public LocalTime getUsualWalkTime() {
        return usualWalkTime;
    }

    public void setUsualWalkTime(LocalTime usualWalkTime) {
        this.usualWalkTime = usualWalkTime;
    }

    public String getRoutinePattern() {
        return routinePattern;
    }

    public void setRoutinePattern(String routinePattern) {
        this.routinePattern = routinePattern;
    }

    public Boolean getFallDetectionEnabled() {
        return fallDetectionEnabled;
    }

    public void setFallDetectionEnabled(Boolean fallDetectionEnabled) {
        this.fallDetectionEnabled = fallDetectionEnabled;
    }

    public Boolean getLocationTrackingEnabled() {
        return locationTrackingEnabled;
    }

    public void setLocationTrackingEnabled(Boolean locationTrackingEnabled) {
        this.locationTrackingEnabled = locationTrackingEnabled;
    }

    public Boolean getBiometricEnabled() {
        return biometricEnabled;
    }

    public void setBiometricEnabled(Boolean biometricEnabled) {
        this.biometricEnabled = biometricEnabled;
    }

    public Double getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(Double safetyScore) {
        this.safetyScore = safetyScore;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
