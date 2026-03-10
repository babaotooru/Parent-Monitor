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
 * Guardian Dashboard Service
 * Provides comprehensive overview for guardians monitoring their parents
 */
@Service
public class GuardianDashboardService {

    private static final Logger log = LoggerFactory.getLogger(GuardianDashboardService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SafetyScoreService safetyScoreService;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Get complete dashboard data for a guardian
     */
    public Map<String, Object> getDashboardData(Long guardianId) {
        log.info("Loading dashboard for guardian: {}", guardianId);

        Map<String, Object> dashboard = new HashMap<>();

        // Get all parents under this guardian
        List<User> parents = userRepository.findByGuardianId(guardianId);

        List<Map<String, Object>> parentsData = new ArrayList<>();

        for (User parent : parents) {
            Map<String, Object> parentDashboard = getParentDashboard(parent.getId());
            parentsData.add(parentDashboard);
        }

        dashboard.put("parents", parentsData);
        dashboard.put("totalParents", parents.size());
        dashboard.put("criticalAlerts", getCriticalAlertsCount(parents));
        dashboard.put("unreadNotifications", notificationService.getUnreadCount(guardianId));
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    /**
     * Get dashboard data for a specific parent
     */
    public Map<String, Object> getParentDashboard(Long parentId) {
        log.info("Loading parent dashboard: {}", parentId);

        Map<String, Object> dashboard = new HashMap<>();

        User parent = userRepository.findById(parentId).orElse(null);
        if (parent == null) {
            dashboard.put("error", "Parent not found");
            return dashboard;
        }

        // Basic Info
        dashboard.put("parentId", parent.getId());
        dashboard.put("name", parent.getFullName());
        dashboard.put("age", parent.getAge());
        dashboard.put("profilePicture", parent.getProfilePicture());
        dashboard.put("lastActivity", parent.getLastActivity());

        // Today's Safety Score
        LocalDate today = LocalDate.now();
        Optional<SafetyScore> todayScore = safetyScoreService.getScoreForDate(parentId, today);
        if (todayScore.isPresent()) {
            SafetyScore score = todayScore.get();
            Map<String, Object> scoreData = new HashMap<>();
            scoreData.put("overall", score.getOverallScore());
            scoreData.put("activity", score.getActivityScore());
            scoreData.put("medicine", score.getMedicineComplianceScore());
            scoreData.put("movement", score.getMovementScore());
            scoreData.put("mood", score.getMoodScore());
            scoreData.put("riskLevel", score.getRiskLevel());
            scoreData.put("riskFactors", score.getRiskFactors());
            scoreData.put("insights", score.getAiInsights());
            dashboard.put("safetyScore", scoreData);
        } else {
            dashboard.put("safetyScore", null);
        }

        // Medicine Compliance
        List<Medicine> medicines = medicineRepository.findByUserId(parentId);
        Map<String, Object> medicineData = new HashMap<>();
        medicineData.put("total", medicines.size());
        medicineData.put("takenToday", countTodayMedicines(medicines, Medicine.MedicineStatus.TAKEN));
        medicineData.put("missedToday", countTodayMedicines(medicines, Medicine.MedicineStatus.MISSED));
        medicineData.put("upcomingToday", countTodayMedicines(medicines, Medicine.MedicineStatus.SCHEDULED));
        dashboard.put("medicines", medicineData);

        // Activity Status
        ActivityLog latestActivity = activityLogRepository.findTopByUserIdOrderByTimestampDesc(parentId);
        if (latestActivity != null) {
            Map<String, Object> activityData = new HashMap<>();
            activityData.put("lastUpdate", latestActivity.getTimestamp());
            activityData.put("steps", latestActivity.getStepCount());
            activityData.put("activeMinutes", latestActivity.getActiveMinutes());
            activityData.put("routineScore", latestActivity.getRoutineScore());
            activityData.put("anomalyDetected", latestActivity.getAnomalyDetected());
            dashboard.put("activity", activityData);
        } else {
            dashboard.put("activity", null);
        }

        // Recent Emergencies (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<EmergencyLog> recentEmergencies = emergencyLogRepository
                .findByUserIdAndTimeAfterOrderByTimeDesc(parentId, weekAgo);
        dashboard.put("recentEmergencies", recentEmergencies.size());
        dashboard.put("emergencyList", recentEmergencies);

        // Daily Check-in Status
        LocalDateTime startOfDay = today.atStartOfDay();
        Long checkInCount = dailyCheckInRepository.countByUserIdAndCheckinTimeAfter(parentId, startOfDay);
        dashboard.put("checkedInToday", checkInCount > 0);

        // Status Summary
        String status = determineOverallStatus(todayScore, latestActivity, recentEmergencies);
        dashboard.put("status", status);

        return dashboard;
    }

    /**
     * Get safety score trend (last 30 days)
     */
    public List<SafetyScore> getSafetyScoreTrend(Long parentId, int days) {
        return safetyScoreService.getScoreHistory(parentId, days);
    }

    /**
     * Get activity summary
     */
    public Map<String, Object> getActivitySummary(Long parentId, int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<ActivityLog> logs = activityLogRepository.findByUserIdAndTimestampAfterOrderByTimestampDesc(
                parentId, startDate);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalDays", days);
        summary.put("logsCount", logs.size());
        summary.put("averageSteps", logs.stream()
                .filter(log -> log.getStepCount() != null)
                .mapToInt(ActivityLog::getStepCount)
                .average()
                .orElse(0.0));
        summary.put("averageActiveMinutes", logs.stream()
                .filter(log -> log.getActiveMinutes() != null)
                .mapToInt(ActivityLog::getActiveMinutes)
                .average()
                .orElse(0.0));
        summary.put("anomaliesDetected", logs.stream()
                .filter(log -> log.getAnomalyDetected() != null && log.getAnomalyDetected())
                .count());

        return summary;
    }

    // Helper methods

    private long countTodayMedicines(List<Medicine> medicines, Medicine.MedicineStatus status) {
        return medicines.stream()
                .filter(med -> med.getStatus() == status)
                .count();
    }

    private int getCriticalAlertsCount(List<User> parents) {
        int count = 0;
        LocalDate today = LocalDate.now();

        for (User parent : parents) {
            Optional<SafetyScore> score = safetyScoreService.getScoreForDate(parent.getId(), today);
            if (score.isPresent() && "CRITICAL".equals(score.get().getRiskLevel())) {
                count++;
            }
        }

        return count;

    }

    private String determineOverallStatus(Optional<SafetyScore> score, ActivityLog activity,
            List<EmergencyLog> emergencies) {
        // Check for critical emergencies
        boolean hasCriticalEmergency = emergencies.stream()
                .anyMatch(e -> e.getSeverity() == EmergencyLog.Severity.CRITICAL &&
                        e.getResponseStatus() == EmergencyLog.ResponseStatus.PENDING);

        if (hasCriticalEmergency) {
            return "CRITICAL_EMERGENCY";
        }

        // Check safety score
        if (score.isPresent()) {
            String riskLevel = score.get().getRiskLevel();
            if ("CRITICAL".equals(riskLevel)) {
                return "CRITICAL_RISK";
            } else if ("HIGH".equals(riskLevel)) {
                return "HIGH_RISK";
            }
        }

        // Check activity anomalies
        if (activity != null && activity.getAnomalyDetected() != null && activity.getAnomalyDetected()) {
            return "ANOMALY_DETECTED";
        }

        // All good
        if (score.isPresent() && score.get().getOverallScore() >= 85) {
            return "EXCELLENT";
        }

        return "NORMAL";
    }
}
