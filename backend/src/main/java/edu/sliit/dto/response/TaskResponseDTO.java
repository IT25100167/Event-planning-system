package edu.sliit.dto.response;

import edu.sliit.entity.TaskPriority;
import edu.sliit.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDate dueDate;
    private TaskStatus status;
    private Integer eventId;
    private Integer assigneeId;
    private String assigneeName;
    private Integer milestoneId;
    private String milestoneName;
    private LocalDateTime createdAt;
}
