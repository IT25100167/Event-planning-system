package edu.sliit.dto.request;

import edu.sliit.entity.TaskStatus;
import lombok.Data;

@Data
public class UpdateTaskStatusRequestDTO {
    private TaskStatus status;
}
