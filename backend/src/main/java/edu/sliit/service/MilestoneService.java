package edu.sliit.service;

import edu.sliit.dto.request.CreateMilestoneRequestDTO;
import edu.sliit.dto.response.MilestoneResponseDTO;

import java.util.List;

public interface MilestoneService {
    MilestoneResponseDTO createMilestone(CreateMilestoneRequestDTO request);
    List<MilestoneResponseDTO> getMilestonesByEvent(Integer eventId);
    void deleteMilestone(Integer id);
}
