package edu.sliit.service.impl;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;
import edu.sliit.entity.EventEntity;
import edu.sliit.entity.TaskEntity;
import edu.sliit.entity.TaskStatus;
import edu.sliit.entity.UserEntity;
import edu.sliit.exception.EventNotFoundException;
import edu.sliit.exception.ValidationException;
import edu.sliit.repository.EventRepository;
import edu.sliit.repository.TaskRepository;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    public TaskResponseDTO createTask(CreateTaskRequestDTO request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ValidationException("Task title is required");
        }

        if (request.getEventId() == null) {
            throw new ValidationException("Event ID is required");
        }

        EventEntity event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + request.getEventId()));

        UserEntity assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ValidationException("Assignee not found with ID: " + request.getAssigneeId()));
        }

        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .eventId(request.getEventId())
                .assignee(assignee)
                .status(TaskStatus.PENDING)
                .build();

        TaskEntity savedTask = taskRepository.save(task);
        return mapToResponseDTO(savedTask, event);
    }

    @Override
    public List<TaskResponseDTO> getTasksByEvent(Integer eventId) {
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));

        return taskRepository.findByEventId(eventId)
                .stream()
                .map(task -> mapToResponseDTO(task, event))
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDTO> getTasksByCoordinator(Integer userId) {
        return taskRepository.findByAssigneeUserId(userId)
                .stream()
                .map(task -> {
                    EventEntity event = eventRepository.findById(task.getEventId())
                            .orElse(null);
                    return mapToResponseDTO(task, event);
                })
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDTO updateTaskStatus(Integer taskId, String status) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ValidationException("Task not found with ID: " + taskId));

        try {
            task.setStatus(TaskStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid status: " + status);
        }

        TaskEntity updatedTask = taskRepository.save(task);
        EventEntity event = eventRepository.findById(updatedTask.getEventId()).orElse(null);
        return mapToResponseDTO(updatedTask, event);
    }

    @Override
    public void deleteTask(Integer taskId) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ValidationException("Task not found with ID: " + taskId));
        taskRepository.delete(task);
    }

    private TaskResponseDTO mapToResponseDTO(TaskEntity task, EventEntity event) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getDueDate(),
                task.getStatus(),
                task.getEventId(),
                event != null ? event.getEventName() : null,
                task.getAssignee() != null ? task.getAssignee().getName() : null
        );
    }
}
