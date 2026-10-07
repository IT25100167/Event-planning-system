package edu.sliit.controller;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;
import edu.sliit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody CreateTaskRequestDTO request) {
        TaskResponseDTO response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(taskService.getTasksByEvent(eventId));
    }

    @GetMapping("/coordinator/{userId}")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByCoordinator(@PathVariable Integer userId) {
        return ResponseEntity.ok(taskService.getTasksByCoordinator(userId));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(
            @PathVariable Integer taskId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        TaskResponseDTO response = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
