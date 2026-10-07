package edu.sliit.service.impl;

import edu.sliit.entity.NotificationEntity;
import edu.sliit.entity.TaskEntity;
import edu.sliit.repository.NotificationRepository;
import edu.sliit.service.TaskNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class TaskNotificationServiceImpl implements TaskNotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void notifyAssignee(TaskEntity task) {
        if (task.getAssignee() == null) {
            return;
        }
        String message = "You were assigned a new task: \"" + task.getTitle()
                + "\" (due " + task.getDueDate() + ")";
        notificationRepository.save(NotificationEntity.builder()
                .userId(task.getAssignee().getUserId())
                .message(message)
                .build());
        System.out.println("Notification saved for " + task.getAssignee().getName() + ": " + message);
    }
}