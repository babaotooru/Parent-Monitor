package com.parentcare.controller;

import com.parentcare.model.VideoSession;
import com.parentcare.repository.VideoSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Video Connect REST API Controller
 */
@RestController
@RequestMapping("/api/video")
@CrossOrigin(origins = "*")
public class VideoController {

    @Autowired
    private VideoSessionRepository videoSessionRepository;

    /**
     * Initiate video call
     */
    @PostMapping("/initiate")
    public ResponseEntity<VideoSession> initiateCall(@RequestBody VideoSession session) {
        session.setSessionToken(UUID.randomUUID().toString());
        session.setChannelName("channel-" + System.currentTimeMillis());
        session.setStatus(VideoSession.SessionStatus.INITIATED);
        session.setInitiatedAt(LocalDateTime.now());

        VideoSession saved = videoSessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    /**
     * Start video call
     */
    @PutMapping("/{sessionId}/start")
    public ResponseEntity<VideoSession> startCall(@PathVariable Long sessionId) {
        return videoSessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStatus(VideoSession.SessionStatus.ACTIVE);
                    session.setStartedAt(LocalDateTime.now());
                    return ResponseEntity.ok(videoSessionRepository.save(session));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * End video call
     */
    @PutMapping("/{sessionId}/end")
    public ResponseEntity<VideoSession> endCall(@PathVariable Long sessionId) {
        return videoSessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStatus(VideoSession.SessionStatus.ENDED);
                    session.setEndedAt(LocalDateTime.now());
                    if (session.getStartedAt() != null) {
                        long duration = java.time.Duration.between(
                                session.getStartedAt(),
                                session.getEndedAt()).getSeconds();
                        session.setDurationSeconds((int) duration);
                    }
                    return ResponseEntity.ok(videoSessionRepository.save(session));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get video call history
     */
    @GetMapping("/history")
    public ResponseEntity<List<VideoSession>> getCallHistory(
            @RequestParam Long parentId,
            @RequestParam Long guardianId) {
        List<VideoSession> history = videoSessionRepository
                .findByParentIdAndGuardianIdOrderByInitiatedAtDesc(parentId, guardianId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get last call
     */
    @GetMapping("/last")
    public ResponseEntity<VideoSession> getLastCall(
            @RequestParam Long parentId,
            @RequestParam Long guardianId) {
        VideoSession last = videoSessionRepository
                .findTopByParentIdAndGuardianIdOrderByInitiatedAtDesc(parentId, guardianId);
        if (last != null) {
            return ResponseEntity.ok(last);
        }
        return ResponseEntity.notFound().build();
    }
}
