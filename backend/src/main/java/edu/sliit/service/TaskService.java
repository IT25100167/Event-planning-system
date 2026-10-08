package edu.sliit.service;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;

import java.util.List;

public interface TaskService {
    TaskResponseDTO createTask(CreateTaskRequestDTO request);
    List<TaskResponseDTO> getTasksByEvent(Integer eventId);
    List<TaskResponseDTO> getTasksByCoordinator(Integer userId);
    TaskResponseDTO updateTaskStatus(Integer taskId, String status);
    void deleteTask(Integer taskId);
}
