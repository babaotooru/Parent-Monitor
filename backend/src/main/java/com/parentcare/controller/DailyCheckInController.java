package com.parentcare.controller;

import com.parentcare.model.DailyCheckIn;
import com.parentcare.repository.DailyCheckInRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Daily Check-in REST API Controller
 */
@RestController
@RequestMapping("/api/checkin")
@CrossOrigin(origins = "*")
public class DailyCheckInController {

    @Autowired
    private DailyCheckInRepository dailyCheckInRepository;

    /**
     * Submit daily check-in
     */
    @PostMapping
    public ResponseEntity<DailyCheckIn> submitCheckIn(@RequestBody DailyCheckIn checkIn) {
        checkIn.setCheckinTime(LocalDateTime.now());
        DailyCheckIn saved = dailyCheckInRepository.save(checkIn);
        return ResponseEntity.ok(saved);
    }

    /**
     * Get check-in history for user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DailyCheckIn>> getCheckInHistory(@PathVariable Long userId) {
        List<DailyCheckIn> history = dailyCheckInRepository.findByUserIdOrderByCheckinTimeDesc(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get today's check-in for user
     */
    @GetMapping("/user/{userId}/today")
    public ResponseEntity<DailyCheckIn> getTodayCheckIn(@PathVariable Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        List<DailyCheckIn> todayCheckIns = dailyCheckInRepository
                .findByUserIdAndCheckinTimeBetween(userId, startOfDay, LocalDateTime.now());

        if (!todayCheckIns.isEmpty()) {
            return ResponseEntity.ok(todayCheckIns.get(0));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Check if user has checked in today
     */
    @GetMapping("/user/{userId}/completed-today")
    public ResponseEntity<Boolean> hasCheckedInToday(@PathVariable Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        Long count = dailyCheckInRepository.countByUserIdAndCheckinTimeAfter(userId, startOfDay);
        return ResponseEntity.ok(count > 0);
    }
}
