package edu.sliit.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateVendorPaymentRequestDTO {
    private Integer eventId;
    private Integer vendorId;
    private String serviceDescription;
    private BigDecimal amount;
    private LocalDate dueDate;
}
