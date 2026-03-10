package com.parentcare.controller;

import com.parentcare.model.SafetyScore;
import com.parentcare.service.SafetyScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Safety Score REST API Controller
 */
@RestController
@RequestMapping("/api/safety-score")
@CrossOrigin(origins = "*")
public class SafetyScoreController {

    @Autowired
    private SafetyScoreService safetyScoreService;

    /**
     * Calculate today's safety score for a user
     */
    @PostMapping("/calculate/{userId}")
    public ResponseEntity<SafetyScore> calculateTodayScore(@PathVariable Long userId) {
        SafetyScore score = safetyScoreService.calculateDailyScore(userId, LocalDate.now());
        return ResponseEntity.ok(score);
    }

    /**
     * Calculate safety score for a specific date
     */
    @PostMapping("/calculate/{userId}/{date}")
    public ResponseEntity<SafetyScore> calculateScoreForDate(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        SafetyScore score = safetyScoreService.calculateDailyScore(userId, date);
        return ResponseEntity.ok(score);
    }

    /**
     * Get safety score for today
     */
    @GetMapping("/{userId}/today")
    public ResponseEntity<SafetyScore> getTodayScore(@PathVariable Long userId) {
        return safetyScoreService.getScoreForDate(userId, LocalDate.now())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get safety score for a specific date
     */
    @GetMapping("/{userId}/date/{date}")
    public ResponseEntity<SafetyScore> getScoreForDate(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return safetyScoreService.getScoreForDate(userId, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get safety score history
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<List<SafetyScore>> getScoreHistory(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "30") int days) {
        List<SafetyScore> history = safetyScoreService.getScoreHistory(userId, days);
        return ResponseEntity.ok(history);
    }

    /**
     * Get all users with critical risk
     */
    @GetMapping("/critical")
    public ResponseEntity<List<SafetyScore>> getCriticalRiskUsers() {
        List<SafetyScore> critical = safetyScoreService.getCriticalRiskUsers();
        return ResponseEntity.ok(critical);
    }
}
