package com.parentcare.service;

import com.parentcare.model.*;
import com.parentcare.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Fall Detection Service with AI Analysis
 */
@Service
public class FallDetectionService {

    private static final Logger log = LoggerFactory.getLogger(FallDetectionService.class);

    @Autowired
    private FallDetectionRepository fallDetectionRepository;

    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AIIntelligenceService aiService;

    /**
     * Process accelerometer data and detect falls
     */
    public FallDetection processAccelerometerData(Long userId, Double accX, Double accY, Double accZ,
            Double latitude, Double longitude) {
        log.info("Processing accelerometer data for user: {}", userId);

        // Use AI to analyze sensor data
        Map<String, Object> aiAnalysis = aiService.analyzeFallSensorData(accX, accY, accZ);

        FallDetection fall = new FallDetection();
        fall.setUserId(userId);
        fall.setDetectionType(FallDetection.DetectionType.ACCELEROMETER);
        fall.setAccelerationX(accX);
        fall.setAccelerationY(accY);
        fall.setAccelerationZ(accZ);
        fall.setImpactForce((Double) aiAnalysis.get("impactForce"));
        fall.setLatitude(latitude);
        fall.setLongitude(longitude);
        fall.setConfidenceScore((Double) aiAnalysis.get("confidenceScore"));
        fall.setConfirmedFall((Boolean) aiAnalysis.get("isFall"));
        fall.setAiAnalysis((String) aiAnalysis.get("analysis"));
        fall.setResponseStatus(FallDetection.ResponseStatus.PENDING);
        fall.setDetectedAt(LocalDateTime.now());

        fall = fallDetectionRepository.save(fall);

        // If confirmed fall, create emergency log and send notifications
        if (fall.getConfirmedFall()) {
            createEmergencyLog(fall);
            notificationService.sendFallAlert(userId, fall);
        }

        return fall;
    }

    /**
     * Report fall manually (SOS button)
     */
    public FallDetection reportManualFall(Long userId, Double latitude, Double longitude, String description) {
        log.info("Manual fall reported by user: {}", userId);

        FallDetection fall = new FallDetection();
        fall.setUserId(userId);
        fall.setDetectionType(FallDetection.DetectionType.MANUAL);
        fall.setLatitude(latitude);
        fall.setLongitude(longitude);
        fall.setLocationDescription(description);
        fall.setConfidenceScore(1.0); // Manual report = 100% confidence
        fall.setConfirmedFall(true);
        fall.setAiAnalysis("Manual SOS activation by user");
        fall.setResponseStatus(FallDetection.ResponseStatus.PENDING);
        fall.setDetectedAt(LocalDateTime.now());

        fall = fallDetectionRepository.save(fall);

        createEmergencyLog(fall);
        notificationService.sendFallAlert(userId, fall);

        return fall;
    }

    /**
     * Acknowledge fall detection
     */
    public FallDetection acknowledgeFall(Long fallId, Long guardianId) {
        Optional<FallDetection> optFall = fallDetectionRepository.findById(fallId);
        if (optFall.isPresent()) {
            FallDetection fall = optFall.get();
            fall.setResponseStatus(FallDetection.ResponseStatus.ACKNOWLEDGED);
            fall.setAcknowledgedAt(LocalDateTime.now());
            fall.setAcknowledgedBy(guardianId.toString());
            return fallDetectionRepository.save(fall);
        }
        return null;
    }

    /**
     * Mark fall as false alarm
     */
    public FallDetection markAsFalseAlarm(Long fallId) {
        Optional<FallDetection> optFall = fallDetectionRepository.findById(fallId);
        if (optFall.isPresent()) {
            FallDetection fall = optFall.get();
            fall.setResponseStatus(FallDetection.ResponseStatus.FALSE_ALARM);
            fall.setConfirmedFall(false);
            return fallDetectionRepository.save(fall);
        }
        return null;
    }

    /**
     * Get fall history for user
     */
    public List<FallDetection> getFallHistory(Long userId) {
        return fallDetectionRepository.findByUserIdOrderByDetectedAtDesc(userId);
    }

    /**
     * Get pending falls (need acknowledgment)
     */
    public List<FallDetection> getPendingFalls() {
        return fallDetectionRepository.findByResponseStatus(FallDetection.ResponseStatus.PENDING);
    }

    private void createEmergencyLog(FallDetection fall) {
        EmergencyLog emergency = new EmergencyLog();
        emergency.setUserId(fall.getUserId());
        emergency.setType(EmergencyLog.EmergencyType.FALL);
        emergency.setSeverity(
                fall.getConfidenceScore() > 0.8 ? EmergencyLog.Severity.CRITICAL : EmergencyLog.Severity.HIGH);
        emergency.setDescription("Fall detected - " + fall.getAiAnalysis());
        emergency.setLatitude(fall.getLatitude());
        emergency.setLongitude(fall.getLongitude());
        emergency.setLocationDescription(fall.getLocationDescription());
        emergency.setResponseStatus(EmergencyLog.ResponseStatus.PENDING);
        emergency.setGuardianNotified(true);
        emergency.setAiDetected(true);
        emergency.setConfidenceScore(fall.getConfidenceScore());
        emergency.setAiContext(fall.getAiAnalysis());
        emergency.setTime(fall.getDetectedAt());
        emergency.setCreatedAt(LocalDateTime.now());

        emergencyLogRepository.save(emergency);
    }
}
