package com.parentcare.dto;

public class SafetyScoreDetailOutput {
    private DailyScoreBreakdown dailySafetyScore;
    private int overallScore;
    private String healthTrend;

    public static class DailyScoreBreakdown {
        private int activityScore;
        private int medicineCompliance;
        private int sleepPattern;
        private int mobility;
        private int moodScore;
        private int socialInteraction;

        public DailyScoreBreakdown(int activityScore, int medicineCompliance, int sleepPattern,
                int mobility, int moodScore, int socialInteraction) {
            this.activityScore = activityScore;
            this.medicineCompliance = medicineCompliance;
            this.sleepPattern = sleepPattern;
            this.mobility = mobility;
            this.moodScore = moodScore;
            this.socialInteraction = socialInteraction;
        }

        // Getters
        public int getActivityScore() {
            return activityScore;
        }

        public int getMedicineCompliance() {
            return medicineCompliance;
        }

        public int getSleepPattern() {
            return sleepPattern;
        }

        public int getMobility() {
            return mobility;
        }

        public int getMoodScore() {
            return moodScore;
        }

        public int getSocialInteraction() {
            return socialInteraction;
        }
    }

    // Getters and Setters
    public DailyScoreBreakdown getDailySafetyScore() {
        return dailySafetyScore;
    }

    public void setDailySafetyScore(DailyScoreBreakdown dailySafetyScore) {
        this.dailySafetyScore = dailySafetyScore;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public String getHealthTrend() {
        return healthTrend;
    }

    public void setHealthTrend(String healthTrend) {
        this.healthTrend = healthTrend;
    }
}
