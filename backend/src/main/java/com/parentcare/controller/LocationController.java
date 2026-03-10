package com.parentcare.controller;

import com.parentcare.model.LocationLog;
import com.parentcare.repository.LocationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Location Monitoring REST API Controller
 */
@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationLogRepository locationLogRepository;

    /**
     * Log location update
     */
    @PostMapping
    public ResponseEntity<LocationLog> logLocation(@RequestBody LocationLog locationLog) {
        locationLog.setTimestamp(LocalDateTime.now());
        LocationLog saved = locationLogRepository.save(locationLog);
        return ResponseEntity.ok(saved);
    }

    /**
     * Get current location for user
     */
    @GetMapping("/user/{userId}/current")
    public ResponseEntity<LocationLog> getCurrentLocation(@PathVariable Long userId) {
        LocationLog current = locationLogRepository.findTopByUserIdOrderByTimestampDesc(userId);
        if (current != null) {
            return ResponseEntity.ok(current);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get location history for user
     */
    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<LocationLog>> getLocationHistory(@PathVariable Long userId) {
        List<LocationLog> history = locationLogRepository.findByUserIdOrderByTimestampDesc(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get safe zone violations
     */
    @GetMapping("/user/{userId}/violations")
    public ResponseEntity<List<LocationLog>> getSafeZoneViolations(@PathVariable Long userId) {
        List<LocationLog> violations = locationLogRepository.findByUserIdAndInSafeZoneFalse(userId);
        return ResponseEntity.ok(violations);
    }
}
