package edu.sliit.dto.response;

import edu.sliit.entity.VendorPaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class VendorPaymentResponseDTO {
    private String vendorPaymentId;
    private Integer eventId;
    private Integer vendorId;
    private String serviceDescription;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private VendorPaymentStatus status;
    private String paymentReference;
    private LocalDateTime createdAt;
}
