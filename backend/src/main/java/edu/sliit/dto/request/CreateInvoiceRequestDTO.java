package edu.sliit.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateInvoiceRequestDTO {
    private String bookingId;
    private String customerEmail;
    private BigDecimal baseAmount;
    private BigDecimal discountPercent;
    private LocalDate dueDate;
}
