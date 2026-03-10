package com.parentcare.dto;

public class ActivityMonitoringOutput {
    private DailyActivity dailyActivity;
    private RoutineAnalysis routineAnalysis;
    private String riskLevel;

    public static class DailyActivity {
        private int stepsWalked;
        private String phoneInteraction;
        private String morningActivity;
        private String eveningWalk;
        private int activeMinutes;
        private String activityLevel;

        public DailyActivity(int stepsWalked, String phoneInteraction, String morningActivity,
                String eveningWalk, int activeMinutes, String activityLevel) {
            this.stepsWalked = stepsWalked;
            this.phoneInteraction = phoneInteraction;
            this.morningActivity = morningActivity;
            this.eveningWalk = eveningWalk;
            this.activeMinutes = activeMinutes;
            this.activityLevel = activityLevel;
        }

        // Getters
        public int getStepsWalked() {
            return stepsWalked;
        }

        public String getPhoneInteraction() {
            return phoneInteraction;
        }

        public String getMorningActivity() {
            return morningActivity;
        }

        public String getEveningWalk() {
            return eveningWalk;
        }

        public int getActiveMinutes() {
            return activeMinutes;
        }

        public String getActivityLevel() {
            return activityLevel;
        }
    }

    public static class RoutineAnalysis {
        private String expectedWakeTime;
        private String actualActivity;
        private String alert;
        private String sleepPattern;
        private String walkingPattern;
        private String phoneActivity;

        public RoutineAnalysis(String expectedWakeTime, String actualActivity, String alert,
                String sleepPattern, String walkingPattern, String phoneActivity) {
            this.expectedWakeTime = expectedWakeTime;
            this.actualActivity = actualActivity;
            this.alert = alert;
            this.sleepPattern = sleepPattern;
            this.walkingPattern = walkingPattern;
            this.phoneActivity = phoneActivity;
        }

        // Getters
        public String getExpectedWakeTime() {
            return expectedWakeTime;
        }

        public String getActualActivity() {
            return actualActivity;
        }

        public String getAlert() {
            return alert;
        }

        public String getSleepPattern() {
            return sleepPattern;
        }

        public String getWalkingPattern() {
            return walkingPattern;
        }

        public String getPhoneActivity() {
            return phoneActivity;
        }
    }

    // Getters and Setters
    public DailyActivity getDailyActivity() {
        return dailyActivity;
    }

    public void setDailyActivity(DailyActivity dailyActivity) {
        this.dailyActivity = dailyActivity;
    }

    public RoutineAnalysis getRoutineAnalysis() {
        return routineAnalysis;
    }

    public void setRoutineAnalysis(RoutineAnalysis routineAnalysis) {
        this.routineAnalysis = routineAnalysis;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}
