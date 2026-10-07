package edu.sliit.controller;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.request.UpdateTaskStatusRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;
import edu.sliit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody CreateTaskRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(taskService.getTasksByEvent(eventId));
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByAssignee(@PathVariable Integer assigneeId) {
        return ResponseEntity.ok(taskService.getTasksByAssignee(assigneeId));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponseDTO> updateStatus(
            @PathVariable Integer taskId,
            @RequestBody UpdateTaskStatusRequestDTO request) {
        return ResponseEntity.ok(taskService.updateStatus(taskId, request));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
