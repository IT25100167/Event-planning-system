package edu.sliit.service.impl;

import edu.sliit.entity.TaskEntity;
import edu.sliit.service.TaskNotificationService;
import org.springframework.stereotype.Service;

@Service
public class TaskNotificationServiceImpl implements TaskNotificationService {

    @Override
    public void notifyAssignee(TaskEntity task) {
        if (task.getAssignee() != null) {
            System.out.println("[NOTIFY] Task '" + task.getTitle() + "' assigned to "
                    + task.getAssignee().getEmail() + ", due " + task.getDueDate());
        }
    }

}
