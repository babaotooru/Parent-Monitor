package com.parentcare.controller;

import com.parentcare.model.ActivityLog;
import com.parentcare.model.User;
import com.parentcare.repository.ActivityLogRepository;
import com.parentcare.repository.UserRepository;
import com.parentcare.service.AIIntelligenceService;
import com.parentcare.dto.RealtimeEventDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "*")
public class ActivityLogController {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private AIIntelligenceService aiService;

    @Autowired
    private RealtimeController realtimeController;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<ActivityLog> getByUser(@PathVariable Long userId) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @PostMapping
    public ActivityLog log(@RequestBody ActivityLog log) {
        log.setTimestamp(LocalDateTime.now());
        log.setCreatedAt(LocalDateTime.now());

        // Run AI anomaly detection
        Map<String, Object> anomalies = aiService.detectAnomalies(log.getUserId(), log);
        List<String> detected = (List<String>) anomalies.get("anomaliesDetected");

        if (!detected.isEmpty()) {
            log.setAnomalyDetected(true);
            log.setAnomalyType(detected.get(0));
            log.setAnomalyScore((Double) anomalies.get("anomalyScore"));
            log.setAiAnalysis("Detected: " + String.join(", ", detected));
        } else {
            log.setAnomalyDetected(false);
        }

        ActivityLog saved = activityLogRepository.save(log);

        // Broadcast real-time event
        User user = userRepository.findById(log.getUserId()).orElse(null);
        String userName = user != null ? user.getUsername() : "Unknown";

        String activityDescription = log.getActivityType() != null ? log.getActivityType()
                : (log.getStepCount() != null ? log.getStepCount() + " steps" : "Activity");

        RealtimeEventDTO event = RealtimeEventDTO.activityEvent(
                log.getUserId(),
                userName,
                activityDescription);

        // If anomaly detected, escalate severity
        if (log.getAnomalyDetected() != null && log.getAnomalyDetected()) {
            event.setSeverity("HIGH");
            event.setMessage("Anomaly Detected: " + log.getAnomalyType());
        }

        realtimeController.broadcastEvent(event);

        return saved;
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<ActivityLog> getLatest(@PathVariable Long userId) {
        ActivityLog latest = activityLogRepository.findTopByUserIdOrderByTimestampDesc(userId);
        if (latest != null) {
            return ResponseEntity.ok(latest);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/anomalies")
    public ResponseEntity<List<ActivityLog>> getAllAnomalies() {
        return ResponseEntity.ok(activityLogRepository.findByAnomalyDetectedTrue());
    }

    @GetMapping("/user/{userId}/learn-routine")
    public ResponseEntity<Map<String, Object>> learnRoutine(@PathVariable Long userId) {
        Map<String, Object> patterns = aiService.learnRoutinePatterns(userId);
        return ResponseEntity.ok(patterns);
    }
}