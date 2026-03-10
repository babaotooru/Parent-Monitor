package com.parentcare.service;

import com.parentcare.model.*;
import com.parentcare.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Safety Score Calculation Service
 * Calculates comprehensive daily safety scores based on:
 * - Activity levels
 * - Medicine compliance
 * - Movement patterns
 * - Mood tracking
 */
@Service
public class SafetyScoreService {

    private static final Logger log = LoggerFactory.getLogger(SafetyScoreService.class);

    @Autowired
    private SafetyScoreRepository safetyScoreRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    @Autowired
    private AIIntelligenceService aiService;

    /**
     * Calculate daily safety score for a user
     */
    public SafetyScore calculateDailyScore(Long userId, LocalDate date) {
        log.info("Calculating safety score for user: {} on date: {}", userId, date);

        SafetyScore score = new SafetyScore();
        score.setUserId(userId);
        score.setDate(date);

        // Calculate individual scores
        double activityScore = calculateActivityScore(userId, date);
        double medicineScore = calculateMedicineScore(userId, date);
        double movementScore = calculateMovementScore(userId, date);
        double moodScore = calculateMoodScore(userId, date);

        score.setActivityScore(activityScore);
        score.setMedicineComplianceScore(medicineScore);
        score.setMovementScore(movementScore);
        score.setMoodScore(moodScore);

        // Calculate overall score (weighted average)
        double overall = (activityScore * 0.25) +
                (medicineScore * 0.35) +
                (movementScore * 0.20) +
                (moodScore * 0.20);

        score.setOverallScore(Math.round(overall * 100.0) / 100.0);

        // Determine risk level
        String riskLevel = determineRiskLevel(overall);
        score.setRiskLevel(riskLevel);

        // Identify risk factors
        List<String> riskFactors = identifyRiskFactors(activityScore, medicineScore, movementScore, moodScore);
        score.setRiskFactors(String.join(", ", riskFactors));

        // Generate AI insights and recommendations
        score.setAiInsights(aiService.generateInsights(score));
        score.setRecommendations(aiService.generateRecommendations(score));

        score.setCalculatedAt(LocalDateTime.now());

        return safetyScoreRepository.save(score);
    }

    /**
     * Get safety score for specific date
     */
    public Optional<SafetyScore> getScoreForDate(Long userId, LocalDate date) {
        return safetyScoreRepository.findByUserIdAndDate(userId, date);
    }

    /**
     * Get safety score history
     */
    public List<SafetyScore> getScoreHistory(Long userId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        return safetyScoreRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    /**
     * Get users with critical risk level
     */
    public List<SafetyScore> getCriticalRiskUsers() {
        return safetyScoreRepository.findByRiskLevel("CRITICAL");
    }

    // Private calculation methods

    private double calculateActivityScore(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<ActivityLog> logs = activityLogRepository.findByUserIdAndTimestampBetween(
                userId, startOfDay, endOfDay);

        if (logs.isEmpty()) {
            return 0.0;
        }

        // Aggregate activity metrics
        int totalSteps = logs.stream()
                .filter(log -> log.getStepCount() != null)
                .mapToInt(ActivityLog::getStepCount)
                .sum();

        int totalActiveMinutes = logs.stream()
                .filter(log -> log.getActiveMinutes() != null)
                .mapToInt(ActivityLog::getActiveMinutes)
                .sum();

        // Score calculation
        double stepScore = Math.min(100, (totalSteps / 5000.0) * 100); // 5000 steps = 100
        double activeScore = Math.min(100, (totalActiveMinutes / 30.0) * 100); // 30 min = 100

        return (stepScore + activeScore) / 2.0;
    }

    private double calculateMedicineScore(Long userId, LocalDate date) {
        // Use AI service for medicine compliance
        return aiService.calculateMedicineCompliance(userId);
    }

    private double calculateMovementScore(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<ActivityLog> logs = activityLogRepository.findByUserIdAndTimestampBetween(
                userId, startOfDay, endOfDay);

        if (logs.isEmpty()) {
            return 50.0; // Default score
        }

        // Check for prolonged inactivity
        long inactivityScore = logs.stream()
                .filter(log -> log.getAnomalyDetected() != null && log.getAnomalyDetected())
                .filter(log -> log.getAnomalyType() != null && log.getAnomalyType().equals("INACTIVITY"))
                .count();

        // Calculate routine score
        double avgRoutineScore = logs.stream()
                .filter(log -> log.getRoutineScore() != null)
                .mapToDouble(ActivityLog::getRoutineScore)
                .average()
                .orElse(70.0);

        // Penalize for inactivity events
        double penalty = inactivityScore * 10;

        return Math.max(0, avgRoutineScore - penalty);
    }

    private double calculateMoodScore(Long userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<DailyCheckIn> checkIns = dailyCheckInRepository.findByUserIdAndCheckinTimeBetween(
                userId, startOfDay, endOfDay);

        if (checkIns.isEmpty()) {
            return 70.0; // Default neutral score
        }

        // Convert mood to score
        double totalMoodScore = checkIns.stream()
                .mapToDouble(checkIn -> {
                    switch (checkIn.getMood()) {
                        case EXCELLENT:
                            return 100.0;
                        case GOOD:
                            return 80.0;
                        case OKAY:
                            return 60.0;
                        case BAD:
                            return 40.0;
                        case TERRIBLE:
                            return 20.0;
                        default:
                            return 70.0;
                    }
                })
                .average()
                .orElse(70.0);

        return totalMoodScore;
    }

    private String determineRiskLevel(double overallScore) {
        if (overallScore >= 85)
            return "LOW";
        if (overallScore >= 70)
            return "MEDIUM";
        if (overallScore >= 50)
            return "HIGH";
        return "CRITICAL";
    }

    private List<String> identifyRiskFactors(double activity, double medicine, double movement, double mood) {
        List<String> factors = new ArrayList<>();

        if (activity < 50)
            factors.add("Low Physical Activity");
        if (medicine < 80)
            factors.add("Poor Medicine Compliance");
        if (movement < 50)
            factors.add("Abnormal Movement Patterns");
        if (mood < 50)
            factors.add("Low Mood/Mental Health Concern");

        return factors;
    }
}
