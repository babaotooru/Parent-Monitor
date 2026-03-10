package com.parentcare.dto;

import java.util.List;

public class FallDetectionOutput {
    private String status;
    private String movementLevel;
    private FallEvent lastFallEvent;
    private List<String> alertsSentTo;
    private String actionTaken;

    public static class FallEvent {
        private String time;
        private String location;
        private String severity;
        private boolean guardianNotified;
        private boolean emergencyContactNotified;
        private String responseTime;

        public FallEvent(String time, String location, String severity,
                boolean guardianNotified, boolean emergencyContactNotified, String responseTime) {
            this.time = time;
            this.location = location;
            this.severity = severity;
            this.guardianNotified = guardianNotified;
            this.emergencyContactNotified = emergencyContactNotified;
            this.responseTime = responseTime;
        }

        // Getters
        public String getTime() {
            return time;
        }

        public String getLocation() {
            return location;
        }

        public String getSeverity() {
            return severity;
        }

        public boolean isGuardianNotified() {
            return guardianNotified;
        }

        public boolean isEmergencyContactNotified() {
            return emergencyContactNotified;
        }

        public String getResponseTime() {
            return responseTime;
        }
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMovementLevel() {
        return movementLevel;
    }

    public void setMovementLevel(String movementLevel) {
        this.movementLevel = movementLevel;
    }

    public FallEvent getLastFallEvent() {
        return lastFallEvent;
    }

    public void setLastFallEvent(FallEvent lastFallEvent) {
        this.lastFallEvent = lastFallEvent;
    }

    public List<String> getAlertsSentTo() {
        return alertsSentTo;
    }

    public void setAlertsSentTo(List<String> alertsSentTo) {
        this.alertsSentTo = alertsSentTo;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }
}
