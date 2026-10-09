package edu.sliit.dto.response;

import edu.sliit.entity.QuotationStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class QuotationResponseDTO {
    private String quotationId;
    private String bookingId;
    private String packageId;
    private BigDecimal subtotal;
    private BigDecimal discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal taxRate;
    private BigDecimal taxAmount;
    private BigDecimal estimatedTotal;
    private QuotationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
