package edu.sliit.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerPaymentResponseDTO {
    private String paymentId;
    private String invoiceId;
    private String bookingId;
    private BigDecimal amount;
    private String paymentMethod;
    private String reference;
    private LocalDateTime paidAt;
}
