package edu.sliit.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateEventBudgetRequestDTO {
    private Integer eventId;
    private BigDecimal allocatedBudget;
}
