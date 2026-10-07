package edu.sliit.service;

import edu.sliit.entity.TaskEntity;

public interface TaskNotificationService {
    void notifyAssignee(TaskEntity task);
}


