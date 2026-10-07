package edu.sliit.service.impl;

import edu.sliit.entity.NotificationEntity;
import edu.sliit.exception.TaskNotFoundException;
import edu.sliit.repository.NotificationRepository;
import edu.sliit.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationEntity> getForUser(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public NotificationEntity markRead(Integer id) {
        NotificationEntity n = notificationRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Notification not found with id: " + id));
        n.setSeen(true);
        return notificationRepository.save(n);
    }
}
