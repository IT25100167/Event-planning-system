package edu.sliit.controller;

import edu.sliit.service.monitoring.ActivityLog;
import edu.sliit.service.monitoring.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final ActivityLogService activityLogService;

    @GetMapping("/logs")
    public ResponseEntity<List<ActivityLog>> getRecentLogs() {
        return ResponseEntity.ok(activityLogService.getRecentLogs());
    }
}