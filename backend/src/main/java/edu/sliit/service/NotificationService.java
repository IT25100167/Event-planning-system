package edu.sliit.service;

import edu.sliit.entity.NotificationEntity;

import java.util.List;

public interface NotificationService {
    List<NotificationEntity> getForUser(Integer userId);
    NotificationEntity markRead(Integer id);
}
