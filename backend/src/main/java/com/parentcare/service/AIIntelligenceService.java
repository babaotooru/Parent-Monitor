package com.parentcare.service;

import com.parentcare.model.*;
import com.parentcare.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * AI Intelligence Engine - Core AI service for behavior analysis and anomaly
 * detection
 * Simulates ML/AI capabilities for:
 * - Routine learning
 * - Anomaly detection
 * - Risk scoring
 * - Behavior pattern recognition
 */
@Service
public class AIIntelligenceService {

    private static final Logger log = LoggerFactory.getLogger(AIIntelligenceService.class);

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    /**
     * Learn user's normal routine patterns from historical data
     */
    public Map<String, Object> learnRoutinePatterns(Long userId) {
        log.info("Learning routine patterns for user: {}", userId);

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<ActivityLog> recentLogs = activityLogRepository.findByUserIdAndTimestampAfterOrderByTimestampDesc(
                userId, thirtyDaysAgo);

        Map<String, Object> patterns = new HashMap<>();

        if (recentLogs.isEmpty()) {
            patterns.put("status", "INSUFFICIENT_DATA");
            return patterns;
        }

        // Analyze wake time pattern
        List<LocalTime> wakeTimes = recentLogs.stream()
                .filter(log -> log.getWakeUpTime() != null)
                .map(ActivityLog::getWakeUpTime)
                .toList();

        if (!wakeTimes.isEmpty()) {
            LocalTime avgWakeTime = calculateAverageTime(wakeTimes);
            patterns.put("averageWakeTime", avgWakeTime);
            patterns.put("wakeTimeConsistency", calculateTimeConsistency(wakeTimes));
        }

        // Analyze sleep time pattern
        List<LocalTime> sleepTimes = recentLogs.stream()
                .filter(log -> log.getSleepTime() != null)
                .map(ActivityLog::getSleepTime)
                .toList();

        if (!sleepTimes.isEmpty()) {
            LocalTime avgSleepTime = calculateAverageTime(sleepTimes);
            patterns.put("averageSleepTime", avgSleepTime);
            patterns.put("sleepTimeConsistency", calculateTimeConsistency(sleepTimes));
        }

        // Analyze activity patterns
        double avgSteps = recentLogs.stream()
                .filter(log -> log.getStepCount() != null)
                .mapToInt(ActivityLog::getStepCount)
                .average()
                .orElse(0.0);
        patterns.put("averageDailySteps", avgSteps);

        double avgActiveMinutes = recentLogs.stream()
                .filter(log -> log.getActiveMinutes() != null)
                .mapToInt(ActivityLog::getActiveMinutes)
                .average()
                .orElse(0.0);
        patterns.put("averageActiveMinutes", avgActiveMinutes);

        patterns.put("status", "LEARNED");
        patterns.put("datapointsAnalyzed", recentLogs.size());

        return patterns;
    }

    /**
     * Detect anomalies in current behavior vs learned patterns
     */
    public Map<String, Object> detectAnomalies(Long userId, ActivityLog currentLog) {
        log.info("Detecting anomalies for user: {}", userId);

        Map<String, Object> anomalies = new HashMap<>();
        List<String> detectedAnomalies = new ArrayList<>();
        double anomalyScore = 0.0;

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            anomalies.put("status", "USER_NOT_FOUND");
            return anomalies;
        }

        // Check wake time anomaly
        if (user.getUsualWakeTime() != null && currentLog.getWakeUpTime() != null) {
            long minutesDiff = ChronoUnit.MINUTES.between(
                    user.getUsualWakeTime(),
                    currentLog.getWakeUpTime());

            if (Math.abs(minutesDiff) > 120) { // More than 2 hours difference
                detectedAnomalies.add("UNUSUAL_WAKE_TIME");
                anomalyScore += 0.3;
            }
        }

        // Check for inactivity
        if (currentLog.getStepCount() != null && currentLog.getStepCount() < 100) {
            long hoursSinceTimestamp = ChronoUnit.HOURS.between(currentLog.getTimestamp(), LocalDateTime.now());
            if (hoursSinceTimestamp > 12) {
                detectedAnomalies.add("PROLONGED_INACTIVITY");
                anomalyScore += 0.4;
            }
        }

        // Check phone usage (potential cognitive issues if drastically reduced)
        if (currentLog.getPhoneUnlocks() != null && currentLog.getPhoneUnlocks() < 5) {
            detectedAnomalies.add("REDUCED_PHONE_INTERACTION");
            anomalyScore += 0.2;
        }

        // Check routine score
        if (currentLog.getRoutineScore() != null && currentLog.getRoutineScore() < 60) {
            detectedAnomalies.add("LOW_ROUTINE_ADHERENCE");
            anomalyScore += 0.3;
        }

        anomalies.put("anomaliesDetected", detectedAnomalies);
        anomalies.put("anomalyScore", Math.min(anomalyScore, 1.0));
        anomalies.put("riskLevel", calculateRiskLevel(anomalyScore));
        anomalies.put("timestamp", LocalDateTime.now());

        return anomalies;
    }

    /**
     * Analyze fall detection sensor data using AI
     */
    public Map<String, Object> analyzeFallSensorData(Double accX, Double accY, Double accZ) {
        Map<String, Object> analysis = new HashMap<>();

        // Calculate total acceleration magnitude
        double magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ);

        // Simulate AI model confidence based on impact force
        double confidence = 0.0;
        boolean isFall = false;

        if (magnitude > 25.0) { // Strong impact
            confidence = 0.95;
            isFall = true;
        } else if (magnitude > 20.0) {
            confidence = 0.85;
            isFall = true;
        } else if (magnitude > 15.0) {
            confidence = 0.60;
            isFall = false; // Uncertain
        } else {
            confidence = 0.10;
            isFall = false;
        }

        analysis.put("impactForce", magnitude);
        analysis.put("confidenceScore", confidence);
        analysis.put("isFall", isFall);
        analysis.put("analysis", generateFallAnalysis(magnitude, confidence));

        return analysis;
    }

    /**
     * Calculate medicine compliance score
     */
    public double calculateMedicineCompliance(Long userId) {
        List<Medicine> medicines = medicineRepository.findByUserId(userId);

        if (medicines.isEmpty()) {
            return 100.0; // No medicines = full compliance
        }

        double totalCompliance = 0.0;
        int validMedicines = 0;

        for (Medicine med : medicines) {
            if (med.getTotalTaken() != null && med.getTotalMissed() != null) {
                int total = med.getTotalTaken() + med.getTotalMissed();
                if (total > 0) {
                    double compliance = (double) med.getTotalTaken() / total * 100.0;
                    totalCompliance += compliance;
                    validMedicines++;
                }
            }
        }

        return validMedicines > 0 ? totalCompliance / validMedicines : 100.0;
    }

    /**
     * Generate AI insights based on user data
     */
    public String generateInsights(SafetyScore score) {
        StringBuilder insights = new StringBuilder();

        if (score.getActivityScore() < 50) {
            insights.append("Low activity detected. Encourage more movement. ");
        }

        if (score.getMedicineComplianceScore() < 80) {
            insights.append("Medicine compliance needs improvement. Set reminders. ");
        }

        if (score.getMoodScore() < 50) {
            insights.append("Low mood detected. Consider emotional support. ");
        }

        if (score.getOverallScore() > 85) {
            insights.append("Excellent health status! Keep up the good work. ");
        }

        return insights.toString();
    }

    /**
     * Generate AI recommendations
     */
    public String generateRecommendations(SafetyScore score) {
        StringBuilder recommendations = new StringBuilder();

        if (score.getActivityScore() < 60) {
            recommendations.append("- Schedule daily 15-minute walks\\n");
        }

        if (score.getMedicineComplianceScore() < 90) {
            recommendations.append("- Enable voice reminders for medications\\n");
        }

        if (score.getMovementScore() < 50) {
            recommendations.append("- Set hourly movement alerts\\n");
        }

        return recommendations.toString();
    }

    // Helper methods

    private LocalTime calculateAverageTime(List<LocalTime> times) {
        if (times.isEmpty())
            return null;

        long totalSeconds = times.stream()
                .mapToLong(time -> time.toSecondOfDay())
                .sum();

        long avgSeconds = totalSeconds / times.size();
        return LocalTime.ofSecondOfDay(avgSeconds);
    }

    private double calculateTimeConsistency(List<LocalTime> times) {
        if (times.size() < 2)
            return 100.0;

        LocalTime avg = calculateAverageTime(times);
        double variance = times.stream()
                .mapToDouble(time -> Math.abs(ChronoUnit.MINUTES.between(avg, time)))
                .average()
                .orElse(0.0);

        // Lower variance = higher consistency
        return Math.max(0, 100 - (variance / 60.0 * 100.0));
    }

    private String calculateRiskLevel(double anomalyScore) {
        if (anomalyScore >= 0.7)
            return "CRITICAL";
        if (anomalyScore >= 0.5)
            return "HIGH";
        if (anomalyScore >= 0.3)
            return "MEDIUM";
        return "LOW";
    }

    private String generateFallAnalysis(double magnitude, double confidence) {
        if (confidence > 0.9) {
            return "High-impact fall detected with " + String.format("%.0f", confidence * 100)
                    + "% confidence. Immediate attention required.";
        } else if (confidence > 0.7) {
            return "Possible fall detected. Please verify user status.";
        } else {
            return "Low-confidence event. May be normal movement.";
        }
    }
}
