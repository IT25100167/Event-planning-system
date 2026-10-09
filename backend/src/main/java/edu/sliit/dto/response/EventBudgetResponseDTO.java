package edu.sliit.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class EventBudgetResponseDTO {
    private Integer eventId;
    private BigDecimal allocatedBudget;
    private BigDecimal actualSpend;
    private BigDecimal variance;
    private BigDecimal utilizationPercentage;
    private String status;
}
