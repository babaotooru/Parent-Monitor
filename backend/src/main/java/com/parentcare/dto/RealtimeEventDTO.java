package com.parentcare.dto;

import java.time.LocalDateTime;

/**
 * Real-time Event DTO for WebSocket messaging
 * Used to broadcast events to connected clients
 */
public class RealtimeEventDTO {

    private String type; // ACTIVITY, EMERGENCY, FALL_DETECTION, LOCATION_UPDATE, MEDICINE_REMINDER
    private Long userId;
    private String userName;
    private String message;
    private Object data;
    private LocalDateTime timestamp;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    public RealtimeEventDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public RealtimeEventDTO(String type, Long userId, String userName, String message, Object data, String severity) {
        this.type = type;
        this.userId = userId;
        this.userName = userName;
        this.message = message;
        this.data = data;
        this.severity = severity;
        this.timestamp = LocalDateTime.now();
    }

    // Static factory methods for common event types
    public static RealtimeEventDTO activityEvent(Long userId, String userName, String activity) {
        return new RealtimeEventDTO("ACTIVITY", userId, userName,
                "Activity detected: " + activity, activity, "LOW");
    }

    public static RealtimeEventDTO emergencyEvent(Long userId, String userName, String emergencyType) {
        return new RealtimeEventDTO("EMERGENCY", userId, userName,
                "Emergency detected: " + emergencyType, emergencyType, "CRITICAL");
    }

    public static RealtimeEventDTO fallDetectionEvent(Long userId, String userName, Double confidence) {
        return new RealtimeEventDTO("FALL_DETECTION", userId, userName,
                "Fall detected with " + String.format("%.1f", confidence * 100) + "% confidence",
                confidence, confidence > 0.8 ? "CRITICAL" : "HIGH");
    }

    public static RealtimeEventDTO locationUpdateEvent(Long userId, String userName, String location) {
        return new RealtimeEventDTO("LOCATION_UPDATE", userId, userName,
                "Location updated: " + location, location, "LOW");
    }

    public static RealtimeEventDTO medicineReminderEvent(Long userId, String userName, String medicine) {
        return new RealtimeEventDTO("MEDICINE_REMINDER", userId, userName,
                "Medicine reminder: " + medicine, medicine, "MEDIUM");
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}
