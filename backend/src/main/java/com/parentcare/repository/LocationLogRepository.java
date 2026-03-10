package com.parentcare.repository;

import com.parentcare.model.LocationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LocationLogRepository extends JpaRepository<LocationLog, Long> {
    List<LocationLog> findByUserIdOrderByTimestampDesc(Long userId);

    LocationLog findTopByUserIdOrderByTimestampDesc(Long userId);

    List<LocationLog> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end);

    List<LocationLog> findByUserIdAndInSafeZoneFalse(Long userId);
}
