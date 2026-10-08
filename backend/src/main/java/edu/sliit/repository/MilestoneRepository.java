package edu.sliit.repository;

import edu.sliit.entity.MilestoneEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilestoneRepository extends JpaRepository<MilestoneEntity, Integer> {
    List<MilestoneEntity> findByEventId(Integer eventId);
}
