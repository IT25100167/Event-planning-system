package edu.sliit.service.impl;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;
import edu.sliit.entity.EventEntity;
import edu.sliit.entity.MilestoneEntity;
import edu.sliit.entity.TaskEntity;
import edu.sliit.entity.TaskStatus;
import edu.sliit.entity.UserEntity;
import edu.sliit.exception.EventNotFoundException;
import edu.sliit.exception.ValidationException;
import edu.sliit.repository.EventRepository;
import edu.sliit.repository.MilestoneRepository;
import edu.sliit.repository.TaskRepository;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.TaskNotificationService;
import edu.sliit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskNotificationService taskNotificationService;

    @Override
    public TaskResponseDTO createTask(CreateTaskRequestDTO request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ValidationException("Task title is required");
        }

        if (request.getEventId() == null) {
            throw new ValidationException("Event ID is required");
        }

        if (request.getDueDate() == null) {
            throw new ValidationException("Due date is required");
        }
        if (request.getDueDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Due date cannot be before today.");
        }

        EventEntity event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + request.getEventId()));

        UserEntity assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ValidationException("Assignee not found with ID: " + request.getAssigneeId()));
        }

        MilestoneEntity milestone = null;
        if (request.getMilestoneId() != null) {
            milestone = milestoneRepository.findById(request.getMilestoneId())
                    .orElseThrow(() -> new ValidationException("Milestone not found with ID: " + request.getMilestoneId()));
            if (!milestone.getEventId().equals(request.getEventId())) {
                throw new ValidationException("Milestone does not belong to this event.");
            }
        }

        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .eventId(request.getEventId())
                .assignee(assignee)
                .milestone(milestone)
                .status(TaskStatus.PENDING)
                .build();

        TaskEntity savedTask = taskRepository.save(task);
        taskNotificationService.notifyAssignee(savedTask);
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
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .eventId(task.getEventId())
                .eventName(event != null ? event.getEventName() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getName() : null)
                .milestoneId(task.getMilestone() != null ? task.getMilestone().getId() : null)
                .milestoneName(task.getMilestone() != null ? task.getMilestone().getName() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }
}