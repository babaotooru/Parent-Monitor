package com.parentcare.controller;

import com.parentcare.service.GuardianDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * Guardian Dashboard REST API Controller
 */
@RestController
@RequestMapping("/api/guardian")
@CrossOrigin(origins = "*")
public class GuardianDashboardController {

    @Autowired
    private GuardianDashboardService dashboardService;

    /**
     * Get complete dashboard for guardian
     */
    @GetMapping("/dashboard/{guardianId}")
    public ResponseEntity<Map<String, Object>> getDashboard(@PathVariable Long guardianId) {
        Map<String, Object> dashboard = dashboardService.getDashboardData(guardianId);
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get dashboard for specific parent
     */
    @GetMapping("/parent/{parentId}/dashboard")
    public ResponseEntity<Map<String, Object>> getParentDashboard(@PathVariable Long parentId) {
        Map<String, Object> dashboard = dashboardService.getParentDashboard(parentId);
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get safety score trend for parent
     */
    @GetMapping("/parent/{parentId}/trend")
    public ResponseEntity<Object> getSafetyScoreTrend(
            @PathVariable Long parentId,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(dashboardService.getSafetyScoreTrend(parentId, days));
    }

    /**
     * Get activity summary for parent
     */
    @GetMapping("/parent/{parentId}/activity-summary")
    public ResponseEntity<Map<String, Object>> getActivitySummary(
            @PathVariable Long parentId,
            @RequestParam(defaultValue = "7") int days) {
        Map<String, Object> summary = dashboardService.getActivitySummary(parentId, days);
        return ResponseEntity.ok(summary);
    }
}
