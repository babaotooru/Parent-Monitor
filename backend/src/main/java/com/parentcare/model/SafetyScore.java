package com.parentcare.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "safety_scores")
public class SafetyScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private LocalDate date;

    // Individual Scores (0-100)
    private Double activityScore;
    private Double medicineComplianceScore;
    private Double movementScore;
    private Double moodScore;

    // Overall Safety Score
    private Double overallScore;

    // Risk Indicators
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private String riskFactors; // JSON array of detected risks

    // AI Analysis
    private String aiInsights; // AI-generated insights
    private String recommendations; // AI recommendations

    private LocalDateTime calculatedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getActivityScore() {
        return activityScore;
    }

    public void setActivityScore(Double activityScore) {
        this.activityScore = activityScore;
    }

    public Double getMedicineComplianceScore() {
        return medicineComplianceScore;
    }

    public void setMedicineComplianceScore(Double medicineComplianceScore) {
        this.medicineComplianceScore = medicineComplianceScore;
    }

    public Double getMovementScore() {
        return movementScore;
    }

    public void setMovementScore(Double movementScore) {
        this.movementScore = movementScore;
    }

    public Double getMoodScore() {
        return moodScore;
    }

    public void setMoodScore(Double moodScore) {
        this.moodScore = moodScore;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRiskFactors() {
        return riskFactors;
    }

    public void setRiskFactors(String riskFactors) {
        this.riskFactors = riskFactors;
    }

    public String getAiInsights() {
        return aiInsights;
    }

    public void setAiInsights(String aiInsights) {
        this.aiInsights = aiInsights;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}
