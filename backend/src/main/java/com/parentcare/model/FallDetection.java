package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fall_detections")
public class FallDetection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private DetectionType detectionType; // ACCELEROMETER, WEARABLE, MANUAL

    // Sensor Data
    private Double accelerationX;
    private Double accelerationY;
    private Double accelerationZ;
    private Double impactForce;

    // Location
    private Double latitude;
    private Double longitude;
    private String locationDescription;

    // AI Analysis
    private Double confidenceScore; // AI confidence (0-1)
    private Boolean confirmedFall;
    private String aiAnalysis;

    // Response
    @Enumerated(EnumType.STRING)
    private ResponseStatus responseStatus; // PENDING, NOTIFIED, ACKNOWLEDGED, RESOLVED, FALSE_ALARM

    private LocalDateTime detectedAt;
    private LocalDateTime acknowledgedAt;
    private String acknowledgedBy;

    public enum DetectionType {
        ACCELEROMETER, WEARABLE, MANUAL
    }

    public enum ResponseStatus {
        PENDING, NOTIFIED, ACKNOWLEDGED, RESOLVED, FALSE_ALARM
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

    public DetectionType getDetectionType() {
        return detectionType;
    }

    public void setDetectionType(DetectionType detectionType) {
        this.detectionType = detectionType;
    }

    public Double getAccelerationX() {
        return accelerationX;
    }

    public void setAccelerationX(Double accelerationX) {
        this.accelerationX = accelerationX;
    }

    public Double getAccelerationY() {
        return accelerationY;
    }

    public void setAccelerationY(Double accelerationY) {
        this.accelerationY = accelerationY;
    }

    public Double getAccelerationZ() {
        return accelerationZ;
    }

    public void setAccelerationZ(Double accelerationZ) {
        this.accelerationZ = accelerationZ;
    }

    public Double getImpactForce() {
        return impactForce;
    }

    public void setImpactForce(Double impactForce) {
        this.impactForce = impactForce;
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

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public Boolean getConfirmedFall() {
        return confirmedFall;
    }

    public void setConfirmedFall(Boolean confirmedFall) {
        this.confirmedFall = confirmedFall;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public ResponseStatus getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(ResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }
}
