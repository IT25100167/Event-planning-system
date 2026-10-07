package edu.sliit.service.impl;

import edu.sliit.dto.request.CreateMilestoneRequestDTO;
import edu.sliit.dto.response.MilestoneResponseDTO;
import edu.sliit.entity.MilestoneEntity;
import edu.sliit.repository.MilestoneRepository;
import edu.sliit.service.MilestoneService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MilestoneServiceImpl implements MilestoneService {

    private final MilestoneRepository milestoneRepository;

    public MilestoneServiceImpl(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    @Override
    public MilestoneResponseDTO createMilestone(CreateMilestoneRequestDTO request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Milestone name is required");
        }
        if (request.getDueDate() == null) {
            throw new IllegalArgumentException("Due date is required");
        }
        MilestoneEntity saved = milestoneRepository.save(
                MilestoneEntity.builder()
                        .name(request.getName())
                        .description(request.getDescription())
                        .dueDate(request.getDueDate())
                        .eventId(request.getEventId())
                        .build());
        return toDto(saved);
    }

    @Override
    public List<MilestoneResponseDTO> getMilestonesByEvent(Integer eventId) {
        return milestoneRepository.findByEventId(eventId).stream().map(this::toDto).toList();
    }

    @Override
    public void deleteMilestone(Integer id) {
        milestoneRepository.deleteById(id);
    }

    private MilestoneResponseDTO toDto(MilestoneEntity m) {
        return MilestoneResponseDTO.builder()
                .id(m.getId())
                .name(m.getName())
                .description(m.getDescription())
                .dueDate(m.getDueDate())
                .eventId(m.getEventId())
                .build();
    }
}
