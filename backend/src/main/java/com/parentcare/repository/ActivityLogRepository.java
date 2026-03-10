package com.parentcare.repository;

import com.parentcare.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserId(Long userId);

    List<ActivityLog> findByUserIdOrderByTimestampDesc(Long userId);

    List<ActivityLog> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end);

    List<ActivityLog> findByUserIdAndTimestampAfterOrderByTimestampDesc(Long userId, LocalDateTime after);

    ActivityLog findTopByUserIdOrderByTimestampDesc(Long userId);

    List<ActivityLog> findByAnomalyDetectedTrue();
}