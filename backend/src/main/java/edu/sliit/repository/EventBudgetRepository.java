package edu.sliit.repository;

import edu.sliit.entity.EventBudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventBudgetRepository extends JpaRepository<EventBudgetEntity, Long> {
    Optional<EventBudgetEntity> findByEventId(Integer eventId);
    boolean existsByEventId(Integer eventId);
}
