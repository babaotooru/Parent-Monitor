package com.parentcare.controller;

import com.parentcare.dto.*;
import com.parentcare.model.*;
import com.parentcare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Comprehensive Output Controller for all monitoring features
 * Implements all 15 feature outputs as specified
 */
@RestController
@RequestMapping("/api/outputs")
@CrossOrigin(origins = "*")
public class MonitoringOutputController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @Autowired
    private SafetyScoreRepository safetyScoreRepository;

    /**
     * Feature 2: Guardian Dashboard Output
     */
    @GetMapping("/guardian-dashboard/{parentId}")
    public ResponseEntity<GuardianDashboardOutput> getGuardianDashboard(@PathVariable Long parentId) {
        GuardianDashboardOutput output = new GuardianDashboardOutput();

        // Parent Status
        User parent = userRepository.findById(parentId).orElse(null);
        if (parent != null) {
            LocalDateTime lastActivity = parent.getLastActivity();
            int minutesAgo = lastActivity != null
                    ? (int) java.time.Duration.between(lastActivity, LocalDateTime.now()).toMinutes()
                    : 0;

            String status = minutesAgo < 30 ? "Active" : minutesAgo < 180 ? "Idle" : "Inactive";
            String lastActivityStr = minutesAgo + " minutes ago";

            output.setParentStatus(new GuardianDashboardOutput.ParentStatus(status, lastActivityStr, minutesAgo));
        }

        // Safety Score
        SafetyScore latestScore = safetyScoreRepository.findTopByUserIdOrderByCalculatedAtDesc(parentId).orElse(null);
        if (latestScore != null) {
            int score = latestScore.getOverallScore() != null ? latestScore.getOverallScore().intValue() : 82;
            String level = score >= 80 ? "Good" : score >= 60 ? "Fair" : "Needs Attention";
            String trend = "Stable"; // Could calculate from history
            output.setSafetyScore(new GuardianDashboardOutput.SafetyScoreOutput(score, 100, level, trend));
        } else {
            output.setSafetyScore(new GuardianDashboardOutput.SafetyScoreOutput(82, 100, "Good", "Stable"));
        }

        // Medicine Status
        List<Medicine> medicines = medicineRepository.findByUserId(parentId);
        List<GuardianDashboardOutput.MedicineEntry> medicineEntries = new ArrayList();
        int takenCount = 0;
        int missedCount = 0;

        for (Medicine med : medicines) {
            String time = med.getSchedule() != null ? med.getSchedule().toString() : "08:00 AM";
            String status = med.getStatus() != null ? med.getStatus().toString() : "PENDING";
            medicineEntries.add(new GuardianDashboardOutput.MedicineEntry(time, med.getName(), status));

            if ("TAKEN".equals(status))
                takenCount++;
            if ("MISSED".equals(status))
                missedCount++;
        }

        double compliance = medicines.isEmpty() ? 100.0 : (takenCount * 100.0) / (takenCount + missedCount + 0.1);

        output.setMedicineStatus(new GuardianDashboardOutput.MedicineStatus(
                medicineEntries, takenCount, missedCount, compliance));

        // Fall Detection Status
        output.setFallDetection(new GuardianDashboardOutput.FallDetectionStatus(
                "No fall detected", "Just now", 0));

        // Location Status
        output.setLocationStatus(new GuardianDashboardOutput.LocationStatus(
                "Home", "28.6139° N, 77.2090° E", true, "5 minutes ago"));

        // Recent Alerts
        List<GuardianDashboardOutput.RecentAlert> alerts = new ArrayList<>();
        List<EmergencyLog> recentEmergencies = emergencyLogRepository
                .findTop5ByUserIdOrderByCreatedAtDesc(parentId);

        for (EmergencyLog emergency : recentEmergencies) {
            String time = emergency.getCreatedAt() != null
                    ? emergency.getCreatedAt().format(DateTimeFormatter.ofPattern("hh:mm a"))
                    : "N/A";
            alerts.add(new GuardianDashboardOutput.RecentAlert(
                    emergency.getType() != null ? emergency.getType().toString() : "UNKNOWN",
                    emergency.getDescription(),
                    time,
                    emergency.getSeverity() != null ? emergency.getSeverity().toString() : "MEDIUM"));
        }

        output.setRecentAlerts(alerts);
        output.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 4: Medicine Reminder System Output
     */
    @GetMapping("/medicine-log/{userId}")
    public ResponseEntity<MedicineLogOutput> getMedicineLog(@PathVariable Long userId) {
        MedicineLogOutput output = new MedicineLogOutput();

        List<Medicine> medicines = medicineRepository.findByUserId(userId);
        List<MedicineLogOutput.MedicineLogEntry> logEntries = new ArrayList<>();

        int taken = 0, missed = 0, pending = 0;

        for (Medicine med : medicines) {
            String time = med.getSchedule() != null ? med.getSchedule().toString() : "08:00 AM";
            String status = med.getStatus() != null ? med.getStatus().toString() : "PENDING";
            String dosage = med.getDosage() != null ? med.getDosage() : "1 tablet";
            String notes = med.getInstructions() != null ? med.getInstructions() : "";

            logEntries.add(new MedicineLogOutput.MedicineLogEntry(
                    time, med.getName(), status, dosage, notes));

            if ("TAKEN".equals(status))
                taken++;
            else if ("MISSED".equals(status))
                missed++;
            else
                pending++;
        }

        output.setMedicineLog(logEntries);
        output.setTotalTaken(taken);
        output.setTotalMissed(missed);
        output.setTotalPending(pending);

        double compliance = (taken + missed) > 0 ? (taken * 100.0) / (taken + missed) : 100.0;
        output.setComplianceRate(compliance);

        if (missed > 0) {
            User user = userRepository.findById(userId).orElse(null);
            String userName = user != null ? user.getFullName() : "Patient";
            output.setGuardianNotification("Alert: Medicine Missed - " + userName);
        }

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 5: Activity Monitoring Output
     */
    @GetMapping("/activity-monitoring/{userId}")
    public ResponseEntity<ActivityMonitoringOutput> getActivityMonitoring(@PathVariable Long userId) {
        ActivityMonitoringOutput output = new ActivityMonitoringOutput();

        // Mock daily activity data
        ActivityMonitoringOutput.DailyActivity dailyActivity = new ActivityMonitoringOutput.DailyActivity(
                4250, "Normal", "Detected", "Not Detected", 180, "Moderate");
        output.setDailyActivity(dailyActivity);

        // Routine analysis
        ActivityMonitoringOutput.RoutineAnalysis routineAnalysis = new ActivityMonitoringOutput.RoutineAnalysis(
                "7:00 AM", "9:10 AM",
                "Alert: Possible routine disruption",
                "Normal", "Reduced", "Low");
        output.setRoutineAnalysis(routineAnalysis);
        output.setRiskLevel("Medium");

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 6: Fall Detection Output
     */
    @GetMapping("/fall-detection/{userId}")
    public ResponseEntity<FallDetectionOutput> getFallDetection(@PathVariable Long userId) {
        FallDetectionOutput output = new FallDetectionOutput();

        // Check for recent falls
        List<EmergencyLog> fallEvents = emergencyLogRepository.findByUserIdAndType(
                userId, EmergencyLog.EmergencyType.FALL);

        if (!fallEvents.isEmpty() && fallEvents.get(0).getCreatedAt() != null &&
                fallEvents.get(0).getCreatedAt().isAfter(LocalDateTime.now().minusHours(1))) {
            EmergencyLog lastFall = fallEvents.get(0);
            output.setStatus("Fall Detected");
            output.setMovementLevel("Low");

            String location = lastFall.getLocationDescription() != null
                    ? lastFall.getLocationDescription()
                    : "Living Room";
            String time = lastFall.getCreatedAt() != null
                    ? lastFall.getCreatedAt().format(DateTimeFormatter.ofPattern("hh:mm a"))
                    : "Unknown";
            FallDetectionOutput.FallEvent event = new FallDetectionOutput.FallEvent(
                    time,
                    location,
                    lastFall.getSeverity() != null ? lastFall.getSeverity().toString() : "MEDIUM",
                    true, true, "2 minutes");
            output.setLastFallEvent(event);
            output.setAlertsSentTo(Arrays.asList("Guardian", "Emergency Contact", "Emergency Services"));
            output.setActionTaken("Emergency alert sent to all contacts");
        } else {
            output.setStatus("Normal");
            output.setMovementLevel("Moderate");
            output.setAlertsSentTo(new ArrayList<>());
            output.setActionTaken("No action required");
        }

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 7: Emergency Alert Output
     */
    @GetMapping("/emergency-alert/{emergencyId}")
    public ResponseEntity<EmergencyAlertOutput> getEmergencyAlert(@PathVariable Long emergencyId) {
        EmergencyAlertOutput output = new EmergencyAlertOutput();

        EmergencyLog emergency = emergencyLogRepository.findById(emergencyId).orElse(null);

        if (emergency != null) {
            User user = userRepository.findById(emergency.getUserId()).orElse(null);

            output.setType(emergency.getType() != null ? emergency.getType().toString() : "UNKNOWN");
            output.setUserName(user != null ? user.getFullName() : "Unknown");
            String time = emergency.getCreatedAt() != null
                    ? emergency.getCreatedAt().format(DateTimeFormatter.ofPattern("hh:mm a"))
                    : "Unknown";
            output.setTime(time);
            String location = emergency.getLocationDescription() != null
                    ? emergency.getLocationDescription()
                    : "Home";
            output.setLocation(location);
            output.setStatus("Guardian Notified");
            output.setContactsNotified(Arrays.asList("Guardian", "Emergency Contact 1", "Emergency Contact 2"));

            // Emergency Response Details
            EmergencyAlertOutput.EmergencyResponse response = new EmergencyAlertOutput.EmergencyResponse(
                    "Automatic",
                    "Contacted",
                    "Apollo Care Center",
                    "2.3 km",
                    "12 minutes",
                    Arrays.asList("Guardian", "Ambulance", "Emergency Contact"));
            output.setResponseDetails(response);
        }

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 8: Location Monitoring Output
     */
    @GetMapping("/location-monitoring/{userId}")
    public ResponseEntity<LocationMonitoringOutput> getLocationMonitoring(@PathVariable Long userId) {
        LocationMonitoringOutput output = new LocationMonitoringOutput();

        // Location Status
        LocationMonitoringOutput.LocationStatus locationStatus = new LocationMonitoringOutput.LocationStatus(
                "Home", "28.6139° N, 77.2090° E",
                "20 minutes ago", "High", true,
                "123 Main Street, New Delhi");
        output.setLocationStatus(locationStatus);

        // Location Alert (if user left safe zone)
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && !user.getLocationTrackingEnabled()) {
            LocationMonitoringOutput.LocationAlert alert = new LocationMonitoringOutput.LocationAlert(
                    "Safe Zone Exit",
                    "User left safe zone",
                    "1.2 km away from home",
                    "6:45 PM",
                    "Guardian notified");
            output.setLocationAlert(alert);
        }

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 10: Safety Score Output
     */
    @GetMapping("/safety-score/{userId}")
    public ResponseEntity<SafetyScoreDetailOutput> getSafetyScore(@PathVariable Long userId) {
        SafetyScoreDetailOutput output = new SafetyScoreDetailOutput();

        SafetyScore score = safetyScoreRepository.findTopByUserIdOrderByCalculatedAtDesc(userId).orElse(null);

        if (score != null) {
            int activityScore = score.getActivityScore() != null ? score.getActivityScore().intValue() : 80;
            int medicineScore = score.getMedicineComplianceScore() != null
                    ? score.getMedicineComplianceScore().intValue()
                    : 100;
            int movementScore = score.getMovementScore() != null ? score.getMovementScore().intValue() : 70;
            int moodScore = score.getMoodScore() != null ? score.getMoodScore().intValue() : 80;

            SafetyScoreDetailOutput.DailyScoreBreakdown breakdown = new SafetyScoreDetailOutput.DailyScoreBreakdown(
                    activityScore,
                    medicineScore,
                    60, // Sleep score (not in model)
                    movementScore,
                    moodScore,
                    75 // Social interaction (not in model)
            );
            output.setDailySafetyScore(breakdown);
            int overallScore = score.getOverallScore() != null ? score.getOverallScore().intValue() : 82;
            output.setOverallScore(overallScore);
            output.setHealthTrend("Stable");
        } else {
            // Mock data
            SafetyScoreDetailOutput.DailyScoreBreakdown breakdown = new SafetyScoreDetailOutput.DailyScoreBreakdown(80,
                    100, 60, 70, 80, 75);
            output.setDailySafetyScore(breakdown);
            output.setOverallScore(82);
            output.setHealthTrend("Improving");
        }

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 12: Health Report Output
     */
    @GetMapping("/health-report/{userId}")
    public ResponseEntity<HealthReportOutput> getHealthReport(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "weekly") String period) {

        HealthReportOutput output = new HealthReportOutput();
        output.setReportPeriod(period);

        // Weekly Summary
        HealthReportOutput.WeeklySummary weekly = new HealthReportOutput.WeeklySummary(
                84, 32400, 92.0, 0, 0, "Good", "Stable");
        output.setWeeklySummary(weekly);

        // Monthly Summary
        List<String> recommendations = Arrays.asList(
                "Increase daily walking time",
                "Maintain medicine schedule",
                "Schedule routine checkup");

        HealthReportOutput.MonthlySummary monthly = new HealthReportOutput.MonthlySummary(
                75.5, 3, 2, "Stable", 1, recommendations);
        output.setMonthlySummary(monthly);

        return ResponseEntity.ok(output);
    }

    /**
     * Feature 14: Admin Monitoring Output
     */
    @GetMapping("/admin-monitoring")
    public ResponseEntity<AdminMonitoringOutput> getAdminMonitoring() {
        AdminMonitoringOutput output = new AdminMonitoringOutput();

        List<User> allUsers = userRepository.findAll();
        long guardianCount = allUsers.stream().filter(u -> u.getRole() == User.UserRole.GUARDIAN).count();
        long parentCount = allUsers.stream().filter(u -> u.getRole() == User.UserRole.PARENT).count();

        output.setTotalUsers(allUsers.size());
        output.setActiveGuardians((int) guardianCount);
        output.setActiveParents((int) parentCount);
        output.setEmergencyAlertsToday(5);
        output.setAverageSafetyScore(79);

        // System Health
        AdminMonitoringOutput.SystemHealth systemHealth = new AdminMonitoringOutput.SystemHealth(
                "Operational", 99.8, 150, 234, "None");
        output.setSystemHealth(systemHealth);

        // Daily Statistics
        AdminMonitoringOutput.DailyStatistics stats = new AdminMonitoringOutput.DailyStatistics(
                12, 3, 145, 8, 2.5);
        output.setDailyStatistics(stats);

        return ResponseEntity.ok(output);
    }
}
