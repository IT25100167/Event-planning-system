package edu.sliit.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FinancialSummaryResponseDTO {
    private BigDecimal totalCustomerRevenue;
    private BigDecimal totalVendorExpenses;
    private BigDecimal outstandingCustomerReceivables;
    private BigDecimal outstandingVendorPayables;
    private BigDecimal netCashFlow;
    private long invoiceCount;
    private long paidInvoiceCount;
    private long pendingVendorPaymentCount;
}
