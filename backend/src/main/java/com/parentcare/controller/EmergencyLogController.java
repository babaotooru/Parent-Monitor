package com.parentcare.controller;

import com.parentcare.model.EmergencyLog;
import com.parentcare.model.User;
import com.parentcare.repository.EmergencyLogRepository;
import com.parentcare.repository.UserRepository;
import com.parentcare.dto.RealtimeEventDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyLogController {

    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @Autowired
    private RealtimeController realtimeController;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<EmergencyLog> getByUser(@PathVariable Long userId) {
        return emergencyLogRepository.findByUserIdOrderByTimeDesc(userId);
    }

    @PostMapping
    public EmergencyLog create(@RequestBody EmergencyLog log) {
        log.setTime(LocalDateTime.now());
        log.setCreatedAt(LocalDateTime.now());
        log.setResponseStatus(EmergencyLog.ResponseStatus.PENDING);

        EmergencyLog saved = emergencyLogRepository.save(log);

        // Broadcast emergency alert to all guardians
        User user = userRepository.findById(log.getUserId()).orElse(null);
        String userName = user != null ? user.getUsername() : "Unknown";

        String emergencyType = log.getType() != null ? log.getType().name() : "UNKNOWN";

        RealtimeEventDTO event = RealtimeEventDTO.emergencyEvent(
                log.getUserId(),
                userName,
                emergencyType);

        realtimeController.sendEmergencyAlert(event);

        return saved;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EmergencyLog>> getPendingEmergencies() {
        List<EmergencyLog> pending = emergencyLogRepository
                .findByResponseStatus(EmergencyLog.ResponseStatus.PENDING);
        return ResponseEntity.ok(pending);
    }

    @GetMapping("/critical")
    public ResponseEntity<List<EmergencyLog>> getCriticalEmergencies() {
        List<EmergencyLog> critical = emergencyLogRepository
                .findBySeverity(EmergencyLog.Severity.CRITICAL);
        return ResponseEntity.ok(critical);
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<EmergencyLog> acknowledge(
            @PathVariable Long id,
            @RequestParam Long guardianId) {
        return emergencyLogRepository.findById(id)
                .map(emergency -> {
                    emergency.setResponseStatus(EmergencyLog.ResponseStatus.ACKNOWLEDGED);
                    emergency.setAcknowledgedAt(LocalDateTime.now());
                    emergency.setRespondedBy(guardianId);
                    return ResponseEntity.ok(emergencyLogRepository.save(emergency));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<EmergencyLog> resolve(
            @PathVariable Long id,
            @RequestBody String response) {
        return emergencyLogRepository.findById(id)
                .map(emergency -> {
                    emergency.setResponseStatus(EmergencyLog.ResponseStatus.RESOLVED);
                    emergency.setResolvedAt(LocalDateTime.now());
                    emergency.setResponse(response);
                    return ResponseEntity.ok(emergencyLogRepository.save(emergency));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}