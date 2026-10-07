package edu.sliit.service;

import edu.sliit.dto.request.CreateTaskRequestDTO;
import edu.sliit.dto.request.UpdateTaskStatusRequestDTO;
import edu.sliit.dto.response.TaskResponseDTO;

import java.util.List;

public interface TaskService {
    TaskResponseDTO createTask(CreateTaskRequestDTO request);
    List<TaskResponseDTO> getTasksByEvent(Integer eventId);
    List<TaskResponseDTO> getTasksByAssignee(Integer assigneeId);
    TaskResponseDTO updateStatus(Integer taskId, UpdateTaskStatusRequestDTO request);
    void deleteTask(Integer taskId);
}
