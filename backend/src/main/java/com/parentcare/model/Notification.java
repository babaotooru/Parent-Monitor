package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Recipient
    private Long relatedUserId; // Subject of notification (parent)

    @Enumerated(EnumType.STRING)
    private NotificationType type; // MEDICINE_MISSED, FALL_DETECTED, INACTIVITY, LOW_SAFETY_SCORE, EMERGENCY

    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH, CRITICAL

    private String title;
    private String message;
    private String actionUrl; // Deep link or action URL

    // Status
    private Boolean read;
    private Boolean acknowledged;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;

    // Delivery Channels
    private Boolean sentPush;
    private Boolean sentEmail;
    private Boolean sentSms;

    public enum NotificationType {
        MEDICINE_MISSED, FALL_DETECTED, INACTIVITY, LOW_SAFETY_SCORE,
        EMERGENCY, DAILY_CHECKIN, LOCATION_ALERT, ROUTINE_CHANGE
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
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

    public Long getRelatedUserId() {
        return relatedUserId;
    }

    public void setRelatedUserId(Long relatedUserId) {
        this.relatedUserId = relatedUserId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getActionUrl() {
        return actionUrl;
    }

    public void setActionUrl(String actionUrl) {
        this.actionUrl = actionUrl;
    }

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public Boolean getAcknowledged() {
        return acknowledged;
    }

    public void setAcknowledged(Boolean acknowledged) {
        this.acknowledged = acknowledged;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public Boolean getSentPush() {
        return sentPush;
    }

    public void setSentPush(Boolean sentPush) {
        this.sentPush = sentPush;
    }

    public Boolean getSentEmail() {
        return sentEmail;
    }

    public void setSentEmail(Boolean sentEmail) {
        this.sentEmail = sentEmail;
    }

    public Boolean getSentSms() {
        return sentSms;
    }

    public void setSentSms(Boolean sentSms) {
        this.sentSms = sentSms;
    }
}
