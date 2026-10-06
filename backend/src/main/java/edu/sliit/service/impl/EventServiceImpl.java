package edu.sliit.service.impl;

import edu.sliit.dto.request.AssignEventRequestDTO;
import edu.sliit.dto.request.UpdateEventStatusRequestDTO;
import edu.sliit.dto.response.EventResponseDTO;
import edu.sliit.dto.response.UserResponseDTO;
import edu.sliit.entity.EventEntity;
import edu.sliit.entity.EventStatus;
import edu.sliit.entity.Role;
import edu.sliit.entity.UserEntity;
import edu.sliit.exception.EventNotFoundException;
import edu.sliit.exception.ValidationException;
import edu.sliit.repository.EventRepository;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    public EventResponseDTO assignEvent(AssignEventRequestDTO request) {

        // ---- Validation ----
        if (request.getEventName() == null || request.getEventName().trim().isEmpty()) {
            throw new ValidationException("Event name is required");
        }

        if (request.getEventDate() == null) {
            throw new ValidationException("Event date is required");
        }

        if (request.getEventDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Event date cannot be in the past");
        }

        if (request.getCoordinatorId() == null) {
            throw new ValidationException("Coordinator must be assigned");
        }

        UserEntity coordinator = userRepository.findById(request.getCoordinatorId())
                .orElseThrow(() -> new ValidationException("Coordinator not found with ID: " + request.getCoordinatorId()));

        // ---- Save entity ----
        EventEntity event = new EventEntity();
        event.setEventName(request.getEventName());
        event.setEventDate(request.getEventDate());
        event.setDeadline(request.getDeadline());
        event.setStatus(EventStatus.PLANNING);
        event.setCoordinator(coordinator);
        event.setNotes(request.getNotes());

        EventEntity savedEvent = eventRepository.save(event);

        return mapToResponseDTO(savedEvent);
    }

    @Override
    public EventResponseDTO updateStatus(Integer eventId, UpdateEventStatusRequestDTO request) {

        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));

        if (request.getStatus() == null) {
            throw new ValidationException("Status is required");
        }

        event.setStatus(request.getStatus());
        EventEntity updatedEvent = eventRepository.save(event);

        return mapToResponseDTO(updatedEvent);
    }

    @Override
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDTO getEventById(Integer eventId) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));
        return mapToResponseDTO(event);
    }

    @Override
    public List<UserResponseDTO> getAllCoordinators() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.EVENT_COORDINATOR)
                .map(this::mapUserToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDTO updateEvent(Integer eventId, AssignEventRequestDTO request) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));

        if (request.getEventName() != null && !request.getEventName().trim().isEmpty()) {
            event.setEventName(request.getEventName());
        }

        if (request.getEventDate() != null) {
            // Date එක actually වෙනස් වෙනවා නම් විතරක් past date validation කරන්න
            boolean dateChanged = !request.getEventDate().equals(event.getEventDate());
            if (dateChanged && request.getEventDate().isBefore(LocalDate.now())) {
                throw new ValidationException("Event date cannot be in the past");
            }
            event.setEventDate(request.getEventDate());
        }

        if (request.getDeadline() != null) {
            // Deadline එකත් same logic එක
            boolean deadlineChanged = !request.getDeadline().equals(event.getDeadline());
            if (deadlineChanged && request.getDeadline().isBefore(LocalDate.now())) {
                throw new ValidationException("Deadline cannot be in the past");
            }
            event.setDeadline(request.getDeadline());
        }

        if (request.getCoordinatorId() != null) {
            UserEntity coordinator = userRepository.findById(request.getCoordinatorId())
                    .orElseThrow(() -> new ValidationException("Coordinator not found with ID: " + request.getCoordinatorId()));
            event.setCoordinator(coordinator);
        }

        if (request.getNotes() != null) {
            event.setNotes(request.getNotes());
        }

        EventEntity updatedEvent = eventRepository.save(event);
        return mapToResponseDTO(updatedEvent);
    }

    @Override
    public void deleteEvent(Integer eventId) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));
        eventRepository.delete(event);
    }

    @Override
    public List<EventResponseDTO> getEventsByCoordinator(Integer coordinatorId) {
        return eventRepository.findAll()
                .stream()
                .filter(event -> event.getCoordinator().getUserId().equals(coordinatorId))
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private EventResponseDTO mapToResponseDTO(EventEntity event) {
        return new EventResponseDTO(
                event.getEventId(),
                event.getEventName(),
                event.getEventDate(),
                event.getDeadline(),
                event.getStatus(),
                event.getCoordinator().getUserId(),
                event.getCoordinator().getName(),
                event.getNotes()
        );
    }

    private UserResponseDTO mapUserToResponseDTO(UserEntity user) {
        return new UserResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNum(),
                user.getRole()
        );
    }
}