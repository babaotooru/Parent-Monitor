package com.parentcare.repository;

import com.parentcare.model.SafetyScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SafetyScoreRepository extends JpaRepository<SafetyScore, Long> {
    List<SafetyScore> findByUserIdOrderByDateDesc(Long userId);

    Optional<SafetyScore> findByUserIdAndDate(Long userId, LocalDate date);

    List<SafetyScore> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<SafetyScore> findByRiskLevel(String riskLevel);

    Optional<SafetyScore> findTopByUserIdOrderByCalculatedAtDesc(Long userId);
}
