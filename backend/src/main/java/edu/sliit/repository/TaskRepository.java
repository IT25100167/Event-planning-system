package edu.sliit.repository;

import edu.sliit.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {
    List<TaskEntity> findByEventId(Integer eventId);
    List<TaskEntity> findByAssigneeUserId(Integer userId);
}
