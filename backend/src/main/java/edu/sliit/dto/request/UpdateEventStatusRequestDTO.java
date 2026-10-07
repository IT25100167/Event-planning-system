package edu.sliit.dto.request;

import edu.sliit.entity.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEventStatusRequestDTO {
    private EventStatus status;
}