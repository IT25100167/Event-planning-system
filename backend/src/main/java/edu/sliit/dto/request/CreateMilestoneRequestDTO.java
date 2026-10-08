package edu.sliit.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMilestoneRequestDTO {
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer eventId;
}