package edu.sliit.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignEventRequestDTO {
    private String eventName;
    
    @JsonFormat(pattern = "yyyy-MM-dd", shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING)
    private LocalDate eventDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd", shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING)
    private LocalDate deadline;
    
    private Integer coordinatorId;
    private String notes;
}