package com.parentcare.repository;

import com.parentcare.model.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoSessionRepository extends JpaRepository<VideoSession, Long> {
    List<VideoSession> findByParentIdOrGuardianIdOrderByInitiatedAtDesc(Long parentId, Long guardianId);

    List<VideoSession> findByParentIdAndGuardianIdOrderByInitiatedAtDesc(Long parentId, Long guardianId);

    VideoSession findTopByParentIdAndGuardianIdOrderByInitiatedAtDesc(Long parentId, Long guardianId);
}
