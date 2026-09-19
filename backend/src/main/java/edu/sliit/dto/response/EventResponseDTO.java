package edu.sliit.dto.response;

import edu.sliit.entity.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponseDTO {
    private Integer eventId;
    private String eventName;
    private LocalDate eventDate;
    private LocalDate deadline;
    private EventStatus status;
    private String coordinatorName;
    private String notes;
}