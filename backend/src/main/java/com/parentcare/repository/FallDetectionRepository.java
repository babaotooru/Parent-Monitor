package com.parentcare.repository;

import com.parentcare.model.FallDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FallDetectionRepository extends JpaRepository<FallDetection, Long> {
    List<FallDetection> findByUserIdOrderByDetectedAtDesc(Long userId);

    List<FallDetection> findByResponseStatus(FallDetection.ResponseStatus status);

    List<FallDetection> findByUserIdAndDetectedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    Long countByUserIdAndConfirmedFallTrue(Long userId);
}
