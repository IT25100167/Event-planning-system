package edu.sliit.service.monitoring;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void log(String userEmail, String action, String details, String logType) {

        ActivityLog activityLog = new ActivityLog();

        activityLog.setUserEmail(userEmail);
        activityLog.setAction(action);
        activityLog.setDetails(details);
        activityLog.setLogType(logType);
        activityLog.setTimestamp(LocalDateTime.now());

        activityLogRepository.save(activityLog);
    }

    public List<ActivityLog> getRecentLogs() {
        return activityLogRepository.findTop20ByOrderByTimestampDesc();
    }
}