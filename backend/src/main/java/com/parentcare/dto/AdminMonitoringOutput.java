package com.parentcare.dto;

public class AdminMonitoringOutput {
    private int totalUsers;
    private int activeGuardians;
    private int activeParents;
    private int emergencyAlertsToday;
    private int averageSafetyScore;
    private SystemHealth systemHealth;
    private DailyStatistics dailyStatistics;

    public static class SystemHealth {
        private String status;
        private double uptime;
        private int activeConnections;
        private int alertsProcessed;
        private String lastIncident;

        public SystemHealth(String status, double uptime, int activeConnections,
                int alertsProcessed, String lastIncident) {
            this.status = status;
            this.uptime = uptime;
            this.activeConnections = activeConnections;
            this.alertsProcessed = alertsProcessed;
            this.lastIncident = lastIncident;
        }

        // Getters
        public String getStatus() {
            return status;
        }

        public double getUptime() {
            return uptime;
        }

        public int getActiveConnections() {
            return activeConnections;
        }

        public int getAlertsProcessed() {
            return alertsProcessed;
        }

        public String getLastIncident() {
            return lastIncident;
        }
    }

    public static class DailyStatistics {
        private int newRegistrations;
        private int fallDetections;
        private int medicineReminders;
        private int locationAlerts;
        private double averageResponseTime;

        public DailyStatistics(int newRegistrations, int fallDetections, int medicineReminders,
                int locationAlerts, double averageResponseTime) {
            this.newRegistrations = newRegistrations;
            this.fallDetections = fallDetections;
            this.medicineReminders = medicineReminders;
            this.locationAlerts = locationAlerts;
            this.averageResponseTime = averageResponseTime;
        }

        // Getters
        public int getNewRegistrations() {
            return newRegistrations;
        }

        public int getFallDetections() {
            return fallDetections;
        }

        public int getMedicineReminders() {
            return medicineReminders;
        }

        public int getLocationAlerts() {
            return locationAlerts;
        }

        public double getAverageResponseTime() {
            return averageResponseTime;
        }
    }

    // Getters and Setters
    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getActiveGuardians() {
        return activeGuardians;
    }

    public void setActiveGuardians(int activeGuardians) {
        this.activeGuardians = activeGuardians;
    }

    public int getActiveParents() {
        return activeParents;
    }

    public void setActiveParents(int activeParents) {
        this.activeParents = activeParents;
    }

    public int getEmergencyAlertsToday() {
        return emergencyAlertsToday;
    }

    public void setEmergencyAlertsToday(int emergencyAlertsToday) {
        this.emergencyAlertsToday = emergencyAlertsToday;
    }

    public int getAverageSafetyScore() {
        return averageSafetyScore;
    }

    public void setAverageSafetyScore(int averageSafetyScore) {
        this.averageSafetyScore = averageSafetyScore;
    }

    public SystemHealth getSystemHealth() {
        return systemHealth;
    }

    public void setSystemHealth(SystemHealth systemHealth) {
        this.systemHealth = systemHealth;
    }

    public DailyStatistics getDailyStatistics() {
        return dailyStatistics;
    }

    public void setDailyStatistics(DailyStatistics dailyStatistics) {
        this.dailyStatistics = dailyStatistics;
    }
}
