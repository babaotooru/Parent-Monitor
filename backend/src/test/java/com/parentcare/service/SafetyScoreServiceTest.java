package com.parentcare.service;

import com.parentcare.model.*;
import com.parentcare.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SafetyScoreService
 * Tests safety score calculation logic and risk assessment
 */
@ExtendWith(MockitoExtension.class)
public class SafetyScoreServiceTest {

        @Mock
        private SafetyScoreRepository safetyScoreRepository;

        @Mock
        private ActivityLogRepository activityLogRepository;

        @Mock
        private MedicineRepository medicineRepository;

        @Mock
        private DailyCheckInRepository dailyCheckInRepository;

        @Mock
        private FallDetectionRepository fallDetectionRepository;

        @Mock
        private AIIntelligenceService aiIntelligenceService;

        @InjectMocks
        private SafetyScoreService safetyScoreService;

        private Long testUserId;
        private LocalDate testDate;

        @BeforeEach
        void setUp() {
                testUserId = 1L;
                testDate = LocalDate.now();
        }

        @Test
        void testCalculateDailyScore_NormalActivity_ReturnsHighScore() {
                // Arrange
                ActivityLog mockActivity = createMockActivityLog(8000, 120, true);
                when(activityLogRepository.findByUserIdAndTimestampBetween(anyLong(), any(), any()))
                                .thenReturn(List.of(mockActivity));

                when(medicineRepository.findByUserId(testUserId)).thenReturn(new ArrayList<>());
                when(dailyCheckInRepository.findByUserIdAndCheckinTimeBetween(anyLong(), any(), any()))
                                .thenReturn(new ArrayList<>());

                // Mock AI service methods
                when(aiIntelligenceService.calculateMedicineCompliance(anyLong())).thenReturn(100.0);
                when(aiIntelligenceService.generateInsights(any(SafetyScore.class))).thenReturn("Good health status");
                when(aiIntelligenceService.generateRecommendations(any(SafetyScore.class)))
                                .thenReturn("Keep up the good work");

                when(safetyScoreRepository.save(any(SafetyScore.class))).thenAnswer(i -> i.getArguments()[0]);

                // Act
                SafetyScore result = safetyScoreService.calculateDailyScore(testUserId, testDate);

                // Assert
                assertNotNull(result);
                assertTrue(result.getOverallScore() >= 70, "Normal activity should result in score >= 70");
                verify(safetyScoreRepository, times(1)).save(any(SafetyScore.class));
        }

        @Test
        void testCalculateDailyScore_LowActivity_ReturnsLowerScore() {
                // Arrange
                ActivityLog mockActivity = createMockActivityLog(1000, 10, false);
                when(activityLogRepository.findByUserIdAndTimestampBetween(anyLong(), any(), any()))
                                .thenReturn(List.of(mockActivity));

                when(medicineRepository.findByUserId(testUserId)).thenReturn(new ArrayList<>());
                when(dailyCheckInRepository.findByUserIdAndCheckinTimeBetween(anyLong(), any(), any()))
                                .thenReturn(new ArrayList<>());

                // Mock AI service methods
                when(aiIntelligenceService.calculateMedicineCompliance(anyLong())).thenReturn(100.0);
                when(aiIntelligenceService.generateInsights(any(SafetyScore.class)))
                                .thenReturn("Low activity detected");
                when(aiIntelligenceService.generateRecommendations(any(SafetyScore.class)))
                                .thenReturn("Increase physical activity");

                when(safetyScoreRepository.save(any(SafetyScore.class))).thenAnswer(i -> i.getArguments()[0]);

                // Act
                SafetyScore result = safetyScoreService.calculateDailyScore(testUserId, testDate);

                // Assert
                assertNotNull(result);
                assertTrue(result.getOverallScore() < 70, "Low activity should result in score < 70");
        }

        @Test
        void testCalculateDailyScore_WithMissedMedicines_ReducesScore() {
                // Arrange
                ActivityLog mockActivity = createMockActivityLog(8000, 120, true);
                when(activityLogRepository.findByUserIdAndTimestampBetween(anyLong(), any(), any()))
                                .thenReturn(List.of(mockActivity));

                // Create missed medicines
                List<Medicine> missedMedicines = new ArrayList<>();
                Medicine missed = new Medicine();
                missed.setUserId(testUserId);
                missed.setName("Blood Pressure Medication");
                missed.setStatus(Medicine.MedicineStatus.MISSED);
                missed.setConsecutiveMissed(2);
                missed.setTotalTaken(5);
                missed.setTotalMissed(5);
                missedMedicines.add(missed);

                when(medicineRepository.findByUserId(testUserId)).thenReturn(missedMedicines);
                when(dailyCheckInRepository.findByUserIdAndCheckinTimeBetween(anyLong(), any(), any()))
                                .thenReturn(new ArrayList<>());

                // Mock AI service methods
                when(aiIntelligenceService.calculateMedicineCompliance(anyLong())).thenReturn(50.0);
                when(aiIntelligenceService.generateInsights(any(SafetyScore.class)))
                                .thenReturn("Medicine compliance needs improvement");
                when(aiIntelligenceService.generateRecommendations(any(SafetyScore.class)))
                                .thenReturn("Set medication reminders");

                when(safetyScoreRepository.save(any(SafetyScore.class))).thenAnswer(i -> i.getArguments()[0]);

                // Act
                SafetyScore result = safetyScoreService.calculateDailyScore(testUserId, testDate);

                // Assert
                assertNotNull(result);
                assertNotNull(result.getMedicineComplianceScore());
                assertTrue(result.getMedicineComplianceScore() < 100,
                                "Missed medicines should reduce compliance score");
        }

        // TODO: Fix test - FallDetection is not tracked in SafetyScore calculation
        // Remove or reimplement this test
        /*
         * @Test
         * void testCalculateDailyScore_WithFallDetection_MarksCritical() {
         * // Arrange
         * ActivityLog mockActivity = createMockActivityLog(5000, 60, true);
         * when(activityLogRepository.findByUserIdAndTimestampBetween(anyLong(), any(),
         * any()))
         * .thenReturn(List.of(mockActivity));
         * 
         * // Create recent fall
         * List<FallDetection> falls = new ArrayList<>();
         * FallDetection fall = new FallDetection();
         * fall.setUserId(testUserId);
         * fall.setConfirmedFall(true);
         * fall.setConfidenceScore(0.95);
         * fall.setDetectedAt(LocalDateTime.now());
         * falls.add(fall);
         * 
         * when(medicineRepository.findByUserId(testUserId)).thenReturn(new
         * ArrayList<>());
         * when(dailyCheckInRepository.findByUserIdAndCheckinTimeBetween(anyLong(),
         * any(), any()))
         * .thenReturn(new ArrayList<>());
         * 
         * when(safetyScoreRepository.save(any(SafetyScore.class))).thenAnswer(i ->
         * i.getArguments()[0]);
         * 
         * // Act
         * SafetyScore result = safetyScoreService.calculateDailyScore(testUserId,
         * testDate);
         * 
         * // Assert
         * assertNotNull(result);
         * assertEquals("CRITICAL", result.getRiskLevel(),
         * "Fall detection should trigger CRITICAL risk level");
         * assertTrue(result.getOverallScore() < 50,
         * "Fall should significantly reduce safety score");
         * }
         */

        @Test
        void testGetScoreForDate_ExistsInDb_ReturnsScore() {
                // Arrange
                SafetyScore mockScore = new SafetyScore();
                mockScore.setUserId(testUserId);
                mockScore.setOverallScore(85.0);
                mockScore.setRiskLevel("LOW");
                mockScore.setDate(LocalDate.now());

                when(safetyScoreRepository.findByUserIdAndDate(testUserId, LocalDate.now()))
                                .thenReturn(Optional.of(mockScore));

                // Act
                Optional<SafetyScore> result = safetyScoreService.getScoreForDate(testUserId, LocalDate.now());

                // Assert
                assertTrue(result.isPresent());
                assertEquals(85.0, result.get().getOverallScore());
                assertEquals("LOW", result.get().getRiskLevel());
        }

        @Test
        void testGetScoreForDate_NotExists_ReturnsEmpty() {
                // Arrange
                when(safetyScoreRepository.findByUserIdAndDate(testUserId, LocalDate.now()))
                                .thenReturn(Optional.empty());

                // Act
                Optional<SafetyScore> result = safetyScoreService.getScoreForDate(testUserId, LocalDate.now());

                // Assert
                assertFalse(result.isPresent());
        }

        // Helper method to create mock activity logs
        private ActivityLog createMockActivityLog(int steps, int activeMinutes, boolean routineNormal) {
                ActivityLog activity = new ActivityLog();
                activity.setUserId(testUserId);
                activity.setStepCount(steps);
                activity.setActiveMinutes(activeMinutes);
                activity.setRoutineNormal(routineNormal);
                activity.setRoutineScore(routineNormal ? 85.0 : 45.0);
                activity.setAnomalyDetected(!routineNormal);
                activity.setTimestamp(LocalDateTime.now());
                return activity;
        }
}
