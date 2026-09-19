package edu.sliit.controller;

import edu.sliit.dto.request.AssignEventRequestDTO;
import edu.sliit.dto.request.UpdateEventStatusRequestDTO;
import edu.sliit.dto.response.EventResponseDTO;
import edu.sliit.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EventController {

    private final EventService eventService;

    @PostMapping("/assign")
    public ResponseEntity<EventResponseDTO> assignEvent(@RequestBody AssignEventRequestDTO request) {
        EventResponseDTO response = eventService.assignEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{eventId}/status")
    public ResponseEntity<EventResponseDTO> updateStatus(
            @PathVariable Integer eventId,
            @RequestBody UpdateEventStatusRequestDTO request) {
        EventResponseDTO response = eventService.updateStatus(eventId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Integer eventId) {
        return ResponseEntity.ok(eventService.getEventById(eventId));
    }

    @GetMapping("/coordinators")
    public ResponseEntity<List<edu.sliit.dto.response.UserResponseDTO>> getAllCoordinators() {
        return ResponseEntity.ok(eventService.getAllCoordinators());
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponseDTO> updateEvent(
            @PathVariable Integer eventId,
            @RequestBody AssignEventRequestDTO request) {
        EventResponseDTO response = eventService.updateEvent(eventId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}