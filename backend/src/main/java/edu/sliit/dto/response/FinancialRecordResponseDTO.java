package edu.sliit.dto.response;

import edu.sliit.entity.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FinancialRecordResponseDTO {
    private String transactionId;
    private String bookingId;
    private Integer eventId;
    private TransactionType type;
    private BigDecimal amount;
    private String direction;
    private String reference;
    private LocalDateTime transactionDate;
}
