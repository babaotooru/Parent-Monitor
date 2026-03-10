package com.parentcare.dto;

import java.util.List;

public class GuardianDashboardOutput {
    private ParentStatus parentStatus;
    private SafetyScoreOutput safetyScore;
    private MedicineStatus medicineStatus;
    private FallDetectionStatus fallDetection;
    private LocationStatus locationStatus;
    private List<RecentAlert> recentAlerts;
    private String lastUpdated;

    public static class ParentStatus {
        private String status; // Active, Inactive, Alert
        private String lastActivity;
        private int minutesAgo;

        public ParentStatus(String status, String lastActivity, int minutesAgo) {
            this.status = status;
            this.lastActivity = lastActivity;
            this.minutesAgo = minutesAgo;
        }

        // Getters
        public String getStatus() {
            return status;
        }

        public String getLastActivity() {
            return lastActivity;
        }

        public int getMinutesAgo() {
            return minutesAgo;
        }
    }

    public static class SafetyScoreOutput {
        private int score;
        private int maxScore;
        private String level;
        private String trend;

        public SafetyScoreOutput(int score, int maxScore, String level, String trend) {
            this.score = score;
            this.maxScore = maxScore;
            this.level = level;
            this.trend = trend;
        }

        // Getters
        public int getScore() {
            return score;
        }

        public int getMaxScore() {
            return maxScore;
        }

        public String getLevel() {
            return level;
        }

        public String getTrend() {
            return trend;
        }
    }

    public static class MedicineStatus {
        private List<MedicineEntry> medicines;
        private int takenCount;
        private int missedCount;
        private double complianceRate;

        public MedicineStatus(List<MedicineEntry> medicines, int takenCount, int missedCount, double complianceRate) {
            this.medicines = medicines;
            this.takenCount = takenCount;
            this.missedCount = missedCount;
            this.complianceRate = complianceRate;
        }

        // Getters
        public List<MedicineEntry> getMedicines() {
            return medicines;
        }

        public int getTakenCount() {
            return takenCount;
        }

        public int getMissedCount() {
            return missedCount;
        }

        public double getComplianceRate() {
            return complianceRate;
        }
    }

    public static class MedicineEntry {
        private String time;
        private String name;
        private String status;

        public MedicineEntry(String time, String name, String status) {
            this.time = time;
            this.name = name;
            this.status = status;
        }

        // Getters
        public String getTime() {
            return time;
        }

        public String getName() {
            return name;
        }

        public String getStatus() {
            return status;
        }
    }

    public static class FallDetectionStatus {
        private String status;
        private String lastCheck;
        private int fallsToday;

        public FallDetectionStatus(String status, String lastCheck, int fallsToday) {
            this.status = status;
            this.lastCheck = lastCheck;
            this.fallsToday = fallsToday;
        }

        // Getters
        public String getStatus() {
            return status;
        }

        public String getLastCheck() {
            return lastCheck;
        }

        public int getFallsToday() {
            return fallsToday;
        }
    }

    public static class LocationStatus {
        private String currentLocation;
        private String coordinates;
        private boolean inSafeZone;
        private String lastUpdated;

        public LocationStatus(String currentLocation, String coordinates, boolean inSafeZone, String lastUpdated) {
            this.currentLocation = currentLocation;
            this.coordinates = coordinates;
            this.inSafeZone = inSafeZone;
            this.lastUpdated = lastUpdated;
        }

        // Getters
        public String getCurrentLocation() {
            return currentLocation;
        }

        public String getCoordinates() {
            return coordinates;
        }

        public boolean isInSafeZone() {
            return inSafeZone;
        }

        public String getLastUpdated() {
            return lastUpdated;
        }
    }

    public static class RecentAlert {
        private String type;
        private String message;
        private String time;
        private String severity;

        public RecentAlert(String type, String message, String time, String severity) {
            this.type = type;
            this.message = message;
            this.time = time;
            this.severity = severity;
        }

        // Getters
        public String getType() {
            return type;
        }

        public String getMessage() {
            return message;
        }

        public String getTime() {
            return time;
        }

        public String getSeverity() {
            return severity;
        }
    }

    // Getters and Setters
    public ParentStatus getParentStatus() {
        return parentStatus;
    }

    public void setParentStatus(ParentStatus parentStatus) {
        this.parentStatus = parentStatus;
    }

    public SafetyScoreOutput getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(SafetyScoreOutput safetyScore) {
        this.safetyScore = safetyScore;
    }

    public MedicineStatus getMedicineStatus() {
        return medicineStatus;
    }

    public void setMedicineStatus(MedicineStatus medicineStatus) {
        this.medicineStatus = medicineStatus;
    }

    public FallDetectionStatus getFallDetection() {
        return fallDetection;
    }

    public void setFallDetection(FallDetectionStatus fallDetection) {
        this.fallDetection = fallDetection;
    }

    public LocationStatus getLocationStatus() {
        return locationStatus;
    }

    public void setLocationStatus(LocationStatus locationStatus) {
        this.locationStatus = locationStatus;
    }

    public List<RecentAlert> getRecentAlerts() {
        return recentAlerts;
    }

    public void setRecentAlerts(List<RecentAlert> recentAlerts) {
        this.recentAlerts = recentAlerts;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
