package com.parentcare.dto;

import java.util.List;

public class HealthReportOutput {
    private String reportPeriod;
    private WeeklySummary weeklySummary;
    private MonthlySummary monthlySummary;

    public static class WeeklySummary {
        private int averageSafetyScore;
        private int totalSteps;
        private double medicineCompliance;
        private int emergencyAlerts;
        private int fallDetections;
        private String sleepQuality;
        private String activityTrend;

        public WeeklySummary(int averageSafetyScore, int totalSteps, double medicineCompliance,
                int emergencyAlerts, int fallDetections, String sleepQuality, String activityTrend) {
            this.averageSafetyScore = averageSafetyScore;
            this.totalSteps = totalSteps;
            this.medicineCompliance = medicineCompliance;
            this.emergencyAlerts = emergencyAlerts;
            this.fallDetections = fallDetections;
            this.sleepQuality = sleepQuality;
            this.activityTrend = activityTrend;
        }

        // Getters
        public int getAverageSafetyScore() {
            return averageSafetyScore;
        }

        public int getTotalSteps() {
            return totalSteps;
        }

        public double getMedicineCompliance() {
            return medicineCompliance;
        }

        public int getEmergencyAlerts() {
            return emergencyAlerts;
        }

        public int getFallDetections() {
            return fallDetections;
        }

        public String getSleepQuality() {
            return sleepQuality;
        }

        public String getActivityTrend() {
            return activityTrend;
        }
    }

    public static class MonthlySummary {
        private double averageActivityLevel;
        private int missedMedicines;
        private int routineDeviations;
        private String healthTrend;
        private int doctorVisits;
        private List<String> recommendations;

        public MonthlySummary(double averageActivityLevel, int missedMedicines, int routineDeviations,
                String healthTrend, int doctorVisits, List<String> recommendations) {
            this.averageActivityLevel = averageActivityLevel;
            this.missedMedicines = missedMedicines;
            this.routineDeviations = routineDeviations;
            this.healthTrend = healthTrend;
            this.doctorVisits = doctorVisits;
            this.recommendations = recommendations;
        }

        // Getters
        public double getAverageActivityLevel() {
            return averageActivityLevel;
        }

        public int getMissedMedicines() {
            return missedMedicines;
        }

        public int getRoutineDeviations() {
            return routineDeviations;
        }

        public String getHealthTrend() {
            return healthTrend;
        }

        public int getDoctorVisits() {
            return doctorVisits;
        }

        public List<String> getRecommendations() {
            return recommendations;
        }
    }

    // Getters and Setters
    public String getReportPeriod() {
        return reportPeriod;
    }

    public void setReportPeriod(String reportPeriod) {
        this.reportPeriod = reportPeriod;
    }

    public WeeklySummary getWeeklySummary() {
        return weeklySummary;
    }

    public void setWeeklySummary(WeeklySummary weeklySummary) {
        this.weeklySummary = weeklySummary;
    }

    public MonthlySummary getMonthlySummary() {
        return monthlySummary;
    }

    public void setMonthlySummary(MonthlySummary monthlySummary) {
        this.monthlySummary = monthlySummary;
    }
}
