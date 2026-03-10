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
 * Notification Service
 * Handles all notifications: Push, Email, SMS
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Send fall detection alert
     */
    public Notification sendFallAlert(Long parentId, FallDetection fall) {
        log.info("Sending fall alert for parent: {}", parentId);

        User parent = userRepository.findById(parentId).orElse(null);
        if (parent == null || parent.getGuardianId() == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setUserId(parent.getGuardianId());
        notification.setRelatedUserId(parentId);
        notification.setType(Notification.NotificationType.FALL_DETECTED);
        notification.setPriority(Notification.Priority.CRITICAL);
        notification.setTitle("🚨 FALL DETECTED");
        notification.setMessage(String.format(
                "Fall detected for %s at %s. Confidence: %.0f%%. Please check immediately!",
                parent.getFullName() != null ? parent.getFullName() : "parent",
                fall.getLocationDescription() != null ? fall.getLocationDescription() : "unknown location",
                fall.getConfidenceScore() * 100));
        notification.setActionUrl("/emergency/" + fall.getId());
        notification.setRead(false);
        notification.setAcknowledged(false);
        notification.setSentAt(LocalDateTime.now());
        notification.setSentPush(true);
        notification.setSentEmail(true);
        notification.setSentSms(true);

        return notificationRepository.save(notification);
    }

    /**
     * Send medicine missed alert
     */
    public Notification sendMedicineMissedAlert(Long parentId, Medicine medicine) {
        log.info("Sending medicine missed alert for parent: {}", parentId);

        User parent = userRepository.findById(parentId).orElse(null);
        if (parent == null || parent.getGuardianId() == null) {
            return null;
        }

        if (!medicine.getNotifyGuardianOnMiss()) {
            return null; // Notification not enabled for this medicine
        }

        Notification notification = new Notification();
        notification.setUserId(parent.getGuardianId());
        notification.setRelatedUserId(parentId);
        notification.setType(Notification.NotificationType.MEDICINE_MISSED);
        notification.setPriority(
                medicine.getConsecutiveMissed() >= 3 ? Notification.Priority.HIGH : Notification.Priority.MEDIUM);
        notification.setTitle("💊 Medicine Missed");
        notification.setMessage(String.format(
                "%s missed %s (%d consecutive misses). Please follow up.",
                parent.getFullName() != null ? parent.getFullName() : "Parent",
                medicine.getName(),
                medicine.getConsecutiveMissed()));
        notification.setActionUrl("/medicine/" + medicine.getId());
        notification.setRead(false);
        notification.setSentAt(LocalDateTime.now());
        notification.setSentPush(true);
        notification.setSentEmail(true);

        return notificationRepository.save(notification);
    }

    /**
     * Send inactivity alert
     */
    public Notification sendInactivityAlert(Long parentId, ActivityLog activityLog) {
        log.info("Sending inactivity alert for parent: {}", parentId);

        User parent = userRepository.findById(parentId).orElse(null);
        if (parent == null || parent.getGuardianId() == null) {
            return null;
        }

        Notification notification = new Notification();
        notification.setUserId(parent.getGuardianId());
        notification.setRelatedUserId(parentId);
        notification.setType(Notification.NotificationType.INACTIVITY);
        notification.setPriority(Notification.Priority.HIGH);
        notification.setTitle("⚠️ Unusual Inactivity Detected");
        notification.setMessage(String.format(
                "No activity detected for %s. AI Analysis: %s",
                parent.getFullName() != null ? parent.getFullName() : "parent",
                activityLog.getAiAnalysis() != null ? activityLog.getAiAnalysis() : "Prolonged inactivity detected"));
        notification.setActionUrl("/activity/" + parentId);
        notification.setRead(false);
        notification.setSentAt(LocalDateTime.now());
        notification.setSentPush(true);
        notification.setSentEmail(true);

        return notificationRepository.save(notification);
    }

    /**
     * Send low safety score alert
     */
    public Notification sendLowSafetyScoreAlert(Long parentId, SafetyScore score) {
        log.info("Sending low safety score alert for parent: {}", parentId);

        User parent = userRepository.findById(parentId).orElse(null);
        if (parent == null || parent.getGuardianId() == null) {
            return null;
        }

        Notification.Priority priority = score.getRiskLevel().equals("CRITICAL") ? Notification.Priority.CRITICAL
                : Notification.Priority.HIGH;

        Notification notification = new Notification();
        notification.setUserId(parent.getGuardianId());
        notification.setRelatedUserId(parentId);
        notification.setType(Notification.NotificationType.LOW_SAFETY_SCORE);
        notification.setPriority(priority);
        notification.setTitle("📊 Low Safety Score Alert");
        notification.setMessage(String.format(
                "%s's safety score is %.0f/100 (%s risk). Risk factors: %s",
                parent.getFullName() != null ? parent.getFullName() : "Parent",
                score.getOverallScore(),
                score.getRiskLevel(),
                score.getRiskFactors()));
        notification.setActionUrl("/dashboard/" + parentId);
        notification.setRead(false);
        notification.setSentAt(LocalDateTime.now());
        notification.setSentPush(true);
        notification.setSentEmail(true);

        return notificationRepository.save(notification);
    }

    /**
     * Send daily check-in reminder
     */
    public Notification sendDailyCheckInReminder(Long parentId) {
        log.info("Sending daily check-in reminder to parent: {}", parentId);

        Notification notification = new Notification();
        notification.setUserId(parentId);
        notification.setRelatedUserId(parentId);
        notification.setType(Notification.NotificationType.DAILY_CHECKIN);
        notification.setPriority(Notification.Priority.LOW);
        notification.setTitle("😊 Daily Check-In");
        notification.setMessage("How are you feeling today? Please complete your daily check-in.");
        notification.setActionUrl("/checkin");
        notification.setRead(false);
        notification.setSentAt(LocalDateTime.now());
        notification.setSentPush(true);

        return notificationRepository.save(notification);
    }

    /**
     * Get unread notifications for user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderBySentAtDesc(userId);
    }

    /**
     * Get all notifications for user
     */
    public List<Notification> getAllNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderBySentAtDesc(userId);
    }

    /**
     * Mark notification as read
     */
    public Notification markAsRead(Long notificationId) {
        Optional<Notification> optNotif = notificationRepository.findById(notificationId);
        if (optNotif.isPresent()) {
            Notification notif = optNotif.get();
            notif.setRead(true);
            notif.setReadAt(LocalDateTime.now());
            return notificationRepository.save(notif);
        }
        return null;
    }

    /**
     * Get unread count
     */
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
}
