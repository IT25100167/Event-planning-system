package edu.sliit.dto.request;

import edu.sliit.entity.TaskPriority;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequestDTO {
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Integer eventId;
    private Integer assigneeId;
    private Integer milestoneId;


    private LocalDate eventEndDate;
}
