package com.parentcare.repository;

import com.parentcare.model.DailyCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {
    List<DailyCheckIn> findByUserIdOrderByCheckinTimeDesc(Long userId);

    List<DailyCheckIn> findByUserIdAndCheckinTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);

    Long countByUserIdAndCheckinTimeAfter(Long userId, LocalDateTime after);
}
