package edu.sliit.dto.request;

import edu.sliit.entity.TaskPriority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskRequestDTO {
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Integer eventId;
    private Integer assigneeId;
}
