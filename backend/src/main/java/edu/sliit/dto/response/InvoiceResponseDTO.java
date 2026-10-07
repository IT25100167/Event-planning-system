package edu.sliit.dto.response;

import edu.sliit.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceResponseDTO {
    private String invoiceId;
    private String bookingId;
    private String customerEmail;
    private BigDecimal baseTotal;
    private BigDecimal discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal taxRate;
    private BigDecimal taxAmount;
    private BigDecimal finalAmount;
    private BigDecimal paidAmount;
    private BigDecimal outstandingAmount;
    private PaymentStatus paymentStatus;
    private LocalDateTime issuedDate;
    private LocalDate dueDate;
}
