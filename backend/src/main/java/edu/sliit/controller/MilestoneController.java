package edu.sliit.controller;

import edu.sliit.dto.request.CreateMilestoneRequestDTO;
import edu.sliit.dto.response.MilestoneResponseDTO;
import edu.sliit.service.MilestoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @PostMapping
    public ResponseEntity<MilestoneResponseDTO> create(@RequestBody CreateMilestoneRequestDTO request) {
        return ResponseEntity.ok(milestoneService.createMilestone(request));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<MilestoneResponseDTO>> getByEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByEvent(eventId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        milestoneService.deleteMilestone(id);
        return ResponseEntity.noContent().build();
    }
}
