package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_logs")
public class EmergencyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private EmergencyType type; // FALL, SOS, INACTIVITY, ABNORMAL_BEHAVIOR, MEDICINE_CRITICAL

    @Enumerated(EnumType.STRING)
    private Severity severity; // LOW, MEDIUM, HIGH, CRITICAL

    private String description;

    // Location
    private Double latitude;
    private Double longitude;
    private String locationDescription;

    // Response Tracking
    @Enumerated(EnumType.STRING)
    private ResponseStatus responseStatus; // PENDING, ACKNOWLEDGED, IN_PROGRESS, RESOLVED

    private String response;
    private Long respondedBy; // Guardian user ID
    private LocalDateTime acknowledgedAt;
    private LocalDateTime resolvedAt;

    // Notification Status
    private Boolean guardianNotified;
    private Boolean emergencyContactNotified;
    private String notificationChannels; // JSON array: ["PUSH", "SMS", "EMAIL"]

    // AI Analysis
    private Boolean aiDetected;
    private Double confidenceScore;
    private String aiContext; // AI-provided context

    private LocalDateTime time;
    private LocalDateTime createdAt;

    public enum EmergencyType {
        FALL, SOS, INACTIVITY, ABNORMAL_BEHAVIOR, MEDICINE_CRITICAL, LOCATION_ALERT
    }

    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum ResponseStatus {
        PENDING, ACKNOWLEDGED, IN_PROGRESS, RESOLVED
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public EmergencyType getType() {
        return type;
    }

    public void setType(EmergencyType type) {
        this.type = type;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getLocationDescription() {
        return locationDescription;
    }

    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
    }

    public ResponseStatus getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(ResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public Long getRespondedBy() {
        return respondedBy;
    }

    public void setRespondedBy(Long respondedBy) {
        this.respondedBy = respondedBy;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public Boolean getGuardianNotified() {
        return guardianNotified;
    }

    public void setGuardianNotified(Boolean guardianNotified) {
        this.guardianNotified = guardianNotified;
    }

    public Boolean getEmergencyContactNotified() {
        return emergencyContactNotified;
    }

    public void setEmergencyContactNotified(Boolean emergencyContactNotified) {
        this.emergencyContactNotified = emergencyContactNotified;
    }

    public String getNotificationChannels() {
        return notificationChannels;
    }

    public void setNotificationChannels(String notificationChannels) {
        this.notificationChannels = notificationChannels;
    }

    public Boolean getAiDetected() {
        return aiDetected;
    }

    public void setAiDetected(Boolean aiDetected) {
        this.aiDetected = aiDetected;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getAiContext() {
        return aiContext;
    }

    public void setAiContext(String aiContext) {
        this.aiContext = aiContext;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
