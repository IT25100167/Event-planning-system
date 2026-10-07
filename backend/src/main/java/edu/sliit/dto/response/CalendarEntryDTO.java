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
public class CalendarEntryDTO {
    private String type;      // TASK or MILESTONE
    private Integer id;
    private String title;
    private LocalDate date;
    private String priority;  // only for tasks
    private String status;    // only for tasks
}
