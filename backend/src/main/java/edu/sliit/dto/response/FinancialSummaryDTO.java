package edu.sliit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialSummaryDTO {
    private Double totalCustomerRevenue;
    private Double outstandingCustomerReceivables;
    private Double outstandingVendorPayables;
    private Double netCashFlow;
    private Integer invoiceCount;
    private Integer paidInvoiceCount;
    private Integer pendingVendorPaymentCount;
}
