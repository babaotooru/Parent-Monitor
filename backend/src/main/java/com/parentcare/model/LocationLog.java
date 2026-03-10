package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "location_logs")
public class LocationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Double latitude;
    private Double longitude;
    private String address;

    @Enumerated(EnumType.STRING)
    private LocationType locationType; // HOME, OUTSIDE, MEDICAL, UNKNOWN

    private Double accuracy; // GPS accuracy in meters
    private String activity; // Walking, Stationary, Driving

    // Safe Zone Checking
    private Boolean inSafeZone;
    private String safeZoneName;

    // Anomaly Detection
    private Boolean unusualLocation;
    private String aiNote; // AI-detected anomaly note

    private LocalDateTime timestamp;

    public enum LocationType {
        HOME, OUTSIDE, MEDICAL, UNKNOWN
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocationType getLocationType() {
        return locationType;
    }

    public void setLocationType(LocationType locationType) {
        this.locationType = locationType;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public Boolean getInSafeZone() {
        return inSafeZone;
    }

    public void setInSafeZone(Boolean inSafeZone) {
        this.inSafeZone = inSafeZone;
    }

    public String getSafeZoneName() {
        return safeZoneName;
    }

    public void setSafeZoneName(String safeZoneName) {
        this.safeZoneName = safeZoneName;
    }

    public Boolean getUnusualLocation() {
        return unusualLocation;
    }

    public void setUnusualLocation(Boolean unusualLocation) {
        this.unusualLocation = unusualLocation;
    }

    public String getAiNote() {
        return aiNote;
    }

    public void setAiNote(String aiNote) {
        this.aiNote = aiNote;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
