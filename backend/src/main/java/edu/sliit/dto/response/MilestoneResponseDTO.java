package edu.sliit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer eventId;
}