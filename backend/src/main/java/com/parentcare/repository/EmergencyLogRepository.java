package com.parentcare.repository;

import com.parentcare.model.EmergencyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyLogRepository extends JpaRepository<EmergencyLog, Long> {
    List<EmergencyLog> findByUserId(Long userId);

    List<EmergencyLog> findByUserIdOrderByTimeDesc(Long userId);

    List<EmergencyLog> findByUserIdAndTimeAfterOrderByTimeDesc(Long userId, LocalDateTime after);

    List<EmergencyLog> findByResponseStatus(EmergencyLog.ResponseStatus status);

    List<EmergencyLog> findBySeverity(EmergencyLog.Severity severity);

    List<EmergencyLog> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    List<EmergencyLog> findByUserIdAndType(Long userId, EmergencyLog.EmergencyType type);
}