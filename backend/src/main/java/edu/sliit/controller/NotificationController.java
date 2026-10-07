package edu.sliit.controller;

import edu.sliit.entity.NotificationEntity;
import edu.sliit.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationEntity>> getForUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getForUser(userId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationEntity> markRead(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }
}
