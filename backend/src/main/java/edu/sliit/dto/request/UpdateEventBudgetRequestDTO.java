package edu.sliit.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateEventBudgetRequestDTO {
    private BigDecimal allocatedBudget;
}
