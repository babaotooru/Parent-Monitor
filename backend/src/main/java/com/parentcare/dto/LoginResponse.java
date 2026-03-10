package com.parentcare.dto;

import com.parentcare.model.User;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LoginResponse {
    private String status;
    private boolean success;
    private String message;
    private String userRole;
    private Long userId;
    private String username;
    private String sessionId;
    private String lastLogin;
    private String authMethod;
    private boolean otpVerified;
    private boolean biometricEnabled;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message, User user, String sessionId) {
        this.success = success;
        this.status = success ? "Successful" : "Failed";
        this.message = message;
        if (user != null) {
            this.userRole = user.getRole().toString();
            this.userId = user.getId();
            this.username = user.getUsername();
            this.lastLogin = LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));
            this.otpVerified = true;
            this.biometricEnabled = false;
        }
        this.sessionId = sessionId;
        this.authMethod = "Password";
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(String lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getAuthMethod() {
        return authMethod;
    }

    public void setAuthMethod(String authMethod) {
        this.authMethod = authMethod;
    }

    public boolean isOtpVerified() {
        return otpVerified;
    }

    public void setOtpVerified(boolean otpVerified) {
        this.otpVerified = otpVerified;
    }

    public boolean isBiometricEnabled() {
        return biometricEnabled;
    }

    public void setBiometricEnabled(boolean biometricEnabled) {
        this.biometricEnabled = biometricEnabled;
    }
}
