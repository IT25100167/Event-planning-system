package edu.sliit.service;

import edu.sliit.dto.request.AssignEventRequestDTO;
import edu.sliit.dto.request.UpdateEventStatusRequestDTO;
import edu.sliit.dto.response.EventResponseDTO;
import edu.sliit.dto.response.UserResponseDTO;

import java.util.List;

public interface EventService {
    EventResponseDTO assignEvent(AssignEventRequestDTO request);
    EventResponseDTO updateStatus(Integer eventId, UpdateEventStatusRequestDTO request);
    EventResponseDTO updateEvent(Integer eventId, AssignEventRequestDTO request);
    void deleteEvent(Integer eventId);
    List<EventResponseDTO> getAllEvents();
    EventResponseDTO getEventById(Integer eventId);
    List<UserResponseDTO> getAllCoordinators();
    List<EventResponseDTO> getEventsByCoordinator(Integer coordinatorId);
    List<EventResponseDTO> getMyEvents();
}