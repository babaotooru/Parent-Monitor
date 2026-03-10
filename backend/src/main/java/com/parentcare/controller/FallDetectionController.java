package com.parentcare.controller;

import com.parentcare.model.FallDetection;
import com.parentcare.service.FallDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Fall Detection REST API Controller
 */
@RestController
@RequestMapping("/api/fall-detection")
@CrossOrigin(origins = "*")
public class FallDetectionController {

    @Autowired
    private FallDetectionService fallDetectionService;

    /**
     * Process accelerometer data
     */
    @PostMapping("/detect")
    public ResponseEntity<FallDetection> detectFall(@RequestBody Map<String, Object> data) {
        Long userId = ((Number) data.get("userId")).longValue();
        Double accX = ((Number) data.get("accelerationX")).doubleValue();
        Double accY = ((Number) data.get("accelerationY")).doubleValue();
        Double accZ = ((Number) data.get("accelerationZ")).doubleValue();
        Double lat = data.containsKey("latitude") ? ((Number) data.get("latitude")).doubleValue() : null;
        Double lon = data.containsKey("longitude") ? ((Number) data.get("longitude")).doubleValue() : null;

        FallDetection fall = fallDetectionService.processAccelerometerData(userId, accX, accY, accZ, lat, lon);
        return ResponseEntity.ok(fall);
    }

    /**
     * Manual fall report (SOS button)
     */
    @PostMapping("/sos")
    public ResponseEntity<FallDetection> reportSOS(@RequestBody Map<String, Object> data) {
        Long userId = ((Number) data.get("userId")).longValue();
        Double lat = data.containsKey("latitude") ? ((Number) data.get("latitude")).doubleValue() : null;
        Double lon = data.containsKey("longitude") ? ((Number) data.get("longitude")).doubleValue() : null;
        String description = (String) data.getOrDefault("description", "Manual SOS activated");

        FallDetection fall = fallDetectionService.reportManualFall(userId, lat, lon, description);
        return ResponseEntity.ok(fall);
    }

    /**
     * Acknowledge fall
     */
    @PutMapping("/{fallId}/acknowledge")
    public ResponseEntity<FallDetection> acknowledgeFall(
            @PathVariable Long fallId,
            @RequestParam Long guardianId) {
        FallDetection fall = fallDetectionService.acknowledgeFall(fallId, guardianId);
        if (fall != null) {
            return ResponseEntity.ok(fall);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Mark as false alarm
     */
    @PutMapping("/{fallId}/false-alarm")
    public ResponseEntity<FallDetection> markFalseAlarm(@PathVariable Long fallId) {
        FallDetection fall = fallDetectionService.markAsFalseAlarm(fallId);
        if (fall != null) {
            return ResponseEntity.ok(fall);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get fall history for user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FallDetection>> getFallHistory(@PathVariable Long userId) {
        List<FallDetection> history = fallDetectionService.getFallHistory(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get pending falls
     */
    @GetMapping("/pending")
    public ResponseEntity<List<FallDetection>> getPendingFalls() {
        List<FallDetection> pending = fallDetectionService.getPendingFalls();
        return ResponseEntity.ok(pending);
    }
}
