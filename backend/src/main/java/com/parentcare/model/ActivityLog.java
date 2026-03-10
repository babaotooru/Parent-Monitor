package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    // Movement & Activity Data
    private Integer stepCount;
    private Double distanceKm;
    private String activityType; // Walking, Exercise, Stationary
    private Integer activeMinutes;

    // Phone Usage
    private Integer phoneUnlocks;
    private Integer screenTimeMinutes;
    private Integer appUsageCount;
    private String mostUsedApp;

    // Sleep Tracking
    private LocalTime wakeUpTime;
    private LocalTime sleepTime;
    private Integer sleepDurationMinutes;
    private String sleepQuality; // Good, Fair, Poor

    // Routine Analysis
    private Double routineScore; // AI-calculated 0-100
    private Boolean routineNormal; // AI determination
    private String deviations; // JSON of detected deviations

    // AI Anomaly Detection
    private Boolean anomalyDetected;
    private String anomalyType; // INACTIVITY, UNUSUAL_PATTERN, MISSED_ROUTINE
    private Double anomalyScore; // 0-1 confidence
    private String aiAnalysis; // AI-generated explanation

    private LocalDateTime timestamp;
    private LocalDateTime createdAt;

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

    public Integer getStepCount() {
        return stepCount;
    }

    public void setStepCount(Integer stepCount) {
        this.stepCount = stepCount;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public Integer getActiveMinutes() {
        return activeMinutes;
    }

    public void setActiveMinutes(Integer activeMinutes) {
        this.activeMinutes = activeMinutes;
    }

    public Integer getPhoneUnlocks() {
        return phoneUnlocks;
    }

    public void setPhoneUnlocks(Integer phoneUnlocks) {
        this.phoneUnlocks = phoneUnlocks;
    }

    public Integer getScreenTimeMinutes() {
        return screenTimeMinutes;
    }

    public void setScreenTimeMinutes(Integer screenTimeMinutes) {
        this.screenTimeMinutes = screenTimeMinutes;
    }

    public Integer getAppUsageCount() {
        return appUsageCount;
    }

    public void setAppUsageCount(Integer appUsageCount) {
        this.appUsageCount = appUsageCount;
    }

    public String getMostUsedApp() {
        return mostUsedApp;
    }

    public void setMostUsedApp(String mostUsedApp) {
        this.mostUsedApp = mostUsedApp;
    }

    public LocalTime getWakeUpTime() {
        return wakeUpTime;
    }

    public void setWakeUpTime(LocalTime wakeUpTime) {
        this.wakeUpTime = wakeUpTime;
    }

    public LocalTime getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public Integer getSleepDurationMinutes() {
        return sleepDurationMinutes;
    }

    public void setSleepDurationMinutes(Integer sleepDurationMinutes) {
        this.sleepDurationMinutes = sleepDurationMinutes;
    }

    public String getSleepQuality() {
        return sleepQuality;
    }

    public void setSleepQuality(String sleepQuality) {
        this.sleepQuality = sleepQuality;
    }

    public Double getRoutineScore() {
        return routineScore;
    }

    public void setRoutineScore(Double routineScore) {
        this.routineScore = routineScore;
    }

    public Boolean getRoutineNormal() {
        return routineNormal;
    }

    public void setRoutineNormal(Boolean routineNormal) {
        this.routineNormal = routineNormal;
    }

    public String getDeviations() {
        return deviations;
    }

    public void setDeviations(String deviations) {
        this.deviations = deviations;
    }

    public Boolean getAnomalyDetected() {
        return anomalyDetected;
    }

    public void setAnomalyDetected(Boolean anomalyDetected) {
        this.anomalyDetected = anomalyDetected;
    }

    public String getAnomalyType() {
        return anomalyType;
    }

    public void setAnomalyType(String anomalyType) {
        this.anomalyType = anomalyType;
    }

    public Double getAnomalyScore() {
        return anomalyScore;
    }

    public void setAnomalyScore(Double anomalyScore) {
        this.anomalyScore = anomalyScore;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
