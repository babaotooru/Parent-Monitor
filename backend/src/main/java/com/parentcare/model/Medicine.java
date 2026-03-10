package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String dosage;
    private LocalTime schedule;
    private String frequency; // Daily, Twice, Weekly

    @Enumerated(EnumType.STRING)
    private MedicineStatus status; // SCHEDULED, TAKEN, SKIPPED, MISSED

    // Voice Reminder
    private Boolean voiceReminderEnabled;
    private String customReminderMessage;

    // Tracking
    private LocalDateTime lastTaken;
    private Integer consecutiveMissed; // Track missed doses
    private Integer totalTaken;
    private Integer totalMissed;
    private Double complianceRate; // Percentage

    // Guardian Notification
    private Boolean notifyGuardianOnMiss;
    private Integer missedThreshold; // Alert after X misses

    // Additional Info
    private String instructions;
    private String sideEffects;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum MedicineStatus {
        SCHEDULED, TAKEN, SKIPPED, MISSED
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public LocalTime getSchedule() {
        return schedule;
    }

    public void setSchedule(LocalTime schedule) {
        this.schedule = schedule;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public MedicineStatus getStatus() {
        return status;
    }

    public void setStatus(MedicineStatus status) {
        this.status = status;
    }

    public Boolean getVoiceReminderEnabled() {
        return voiceReminderEnabled;
    }

    public void setVoiceReminderEnabled(Boolean voiceReminderEnabled) {
        this.voiceReminderEnabled = voiceReminderEnabled;
    }

    public String getCustomReminderMessage() {
        return customReminderMessage;
    }

    public void setCustomReminderMessage(String customReminderMessage) {
        this.customReminderMessage = customReminderMessage;
    }

    public LocalDateTime getLastTaken() {
        return lastTaken;
    }

    public void setLastTaken(LocalDateTime lastTaken) {
        this.lastTaken = lastTaken;
    }

    public Integer getConsecutiveMissed() {
        return consecutiveMissed;
    }

    public void setConsecutiveMissed(Integer consecutiveMissed) {
        this.consecutiveMissed = consecutiveMissed;
    }

    public Integer getTotalTaken() {
        return totalTaken;
    }

    public void setTotalTaken(Integer totalTaken) {
        this.totalTaken = totalTaken;
    }

    public Integer getTotalMissed() {
        return totalMissed;
    }

    public void setTotalMissed(Integer totalMissed) {
        this.totalMissed = totalMissed;
    }

    public Double getComplianceRate() {
        return complianceRate;
    }

    public void setComplianceRate(Double complianceRate) {
        this.complianceRate = complianceRate;
    }

    public Boolean getNotifyGuardianOnMiss() {
        return notifyGuardianOnMiss;
    }

    public void setNotifyGuardianOnMiss(Boolean notifyGuardianOnMiss) {
        this.notifyGuardianOnMiss = notifyGuardianOnMiss;
    }

    public Integer getMissedThreshold() {
        return missedThreshold;
    }

    public void setMissedThreshold(Integer missedThreshold) {
        this.missedThreshold = missedThreshold;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getSideEffects() {
        return sideEffects;
    }

    public void setSideEffects(String sideEffects) {
        this.sideEffects = sideEffects;
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
