package edu.sliit.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignEventRequestDTO {
    private String eventName;
    private LocalDate eventDate;
    private LocalDate deadline;
    private Integer coordinatorId;
    private String notes;
}