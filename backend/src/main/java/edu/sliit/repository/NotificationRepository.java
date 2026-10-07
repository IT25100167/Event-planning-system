package edu.sliit.repository;

import edu.sliit.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {
    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
