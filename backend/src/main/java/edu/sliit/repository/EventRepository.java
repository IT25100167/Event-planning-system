package edu.sliit.repository;

import edu.sliit.entity.EventEntity;
import edu.sliit.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<EventEntity, Integer> {
    List<EventEntity> findByStatus(EventStatus status);
    List<EventEntity> findByCoordinator_UserId(Integer coordinatorId);
}