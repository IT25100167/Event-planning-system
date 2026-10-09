package edu.sliit.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateQuotationRequestDTO {
    private String bookingId;
    private String packageId;
    private BigDecimal subtotal;
    private BigDecimal discountPercent;
}
