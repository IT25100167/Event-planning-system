package edu.sliit.repository;

import edu.sliit.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {
    List<MessageEntity> findByEventIdOrderBySentAtAsc(Integer eventId);
}
