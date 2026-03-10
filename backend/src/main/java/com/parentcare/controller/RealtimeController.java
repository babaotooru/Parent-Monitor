package com.parentcare.controller;

import com.parentcare.dto.RealtimeEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * WebSocket Controller for Real-time Communication
 * Handles bidirectional messaging between server and clients
 */
@RestController
@RequestMapping("/api/realtime")
public class RealtimeController {

    private static final Logger logger = LoggerFactory.getLogger(RealtimeController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast event to all connected clients
     */
    public void broadcastEvent(RealtimeEventDTO event) {
        logger.info("Broadcasting event: {} for user: {}", event.getType(), event.getUserId());
        messagingTemplate.convertAndSend("/topic/events", event);
    }

    /**
     * Send event to specific user
     */
    public void sendToUser(String username, RealtimeEventDTO event) {
        logger.info("Sending event to user {}: {}", username, event.getType());
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", event);
    }

    /**
     * Send emergency alert to all guardians
     */
    public void sendEmergencyAlert(RealtimeEventDTO event) {
        logger.warn("Broadcasting EMERGENCY alert: {}", event.getMessage());
        messagingTemplate.convertAndSend("/topic/emergency", event);
    }

    /**
     * REST endpoint to manually trigger an event broadcast
     */
    @PostMapping("/broadcast")
    public void broadcastEventViaRest(@RequestBody RealtimeEventDTO event) {
        broadcastEvent(event);
    }

    /**
     * WebSocket message handler - receives messages from clients
     */
    @MessageMapping("/send")
    @SendTo("/topic/events")
    public RealtimeEventDTO handleMessage(@Payload RealtimeEventDTO event) {
        logger.info("Received message from client: {}", event.getMessage());
        return event;
    }
}
