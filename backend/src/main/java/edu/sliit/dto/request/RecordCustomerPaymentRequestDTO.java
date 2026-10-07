package edu.sliit.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RecordCustomerPaymentRequestDTO {
    private BigDecimal amount;
    private String paymentMethod;
    private String reference;
}
