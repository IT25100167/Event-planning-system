package edu.sliit.service.impl;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.request.UpdateTaskStatusRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;
import edu.sliit.entity.TaskEntity;
import edu.sliit.entity.UserEntity;
import edu.sliit.exception.InvalidDueDateException;
import edu.sliit.exception.TaskNotFoundException;
import edu.sliit.repository.TaskRepository;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.TaskNotificationService;
import edu.sliit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskNotificationService taskNotificationService;

    @Override
    public TaskResponseDTO createTask(CreateTaskRequestDTO request) {
        validateDueDate(request.getDueDate(), request.getEventEndDate());

        UserEntity assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new TaskNotFoundException(
                            "Assignee not found with id: " + request.getAssigneeId()));
        }

        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .eventId(request.getEventId())
                .assignee(assignee)
                .build();

        TaskEntity saved = taskRepository.save(task);
        taskNotificationService.notifyAssignee(saved);

        return toResponse(saved);
    }

    @Override
    public List<TaskResponseDTO> getTasksByEvent(Integer eventId) {
        return taskRepository.findByEventId(eventId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<TaskResponseDTO> getTasksByAssignee(Integer assigneeId) {
        return taskRepository.findByAssignee_UserId(assigneeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TaskResponseDTO updateStatus(Integer taskId, UpdateTaskStatusRequestDTO request) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + taskId));
        task.setStatus(request.getStatus());
        return toResponse(taskRepository.save(task));
    }

    private void validateDueDate(LocalDate dueDate, LocalDate eventEndDate) {
        if (dueDate.isBefore(LocalDate.now())) {
            throw new InvalidDueDateException("Due date cannot be before today.");
        }
        if (eventEndDate != null && dueDate.isAfter(eventEndDate)) {
            throw new InvalidDueDateException("Due date cannot be after the event date.");
        }
    }

    private TaskResponseDTO toResponse(TaskEntity task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .eventId(task.getEventId())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getUserId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getEmail() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }
}