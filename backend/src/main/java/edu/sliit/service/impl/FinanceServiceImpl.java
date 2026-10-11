package edu.sliit.service.impl;

import edu.sliit.dto.response.FinancialSummaryDTO;
import edu.sliit.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FinanceServiceImpl implements FinanceService {

    @Override
    public FinancialSummaryDTO getFinancialSummary() {
        // Mock data for now - replace with actual calculations from database
        // TODO: Calculate from actual invoices, payments, vendor payables tables
        
        FinancialSummaryDTO summary = new FinancialSummaryDTO();
        
        // Sample data
        summary.setTotalCustomerRevenue(5250000.0);
        summary.setOutstandingCustomerReceivables(875000.0);
        summary.setOutstandingVendorPayables(425000.0);
        summary.setNetCashFlow(4400000.0);
        summary.setInvoiceCount(15);
        summary.setPaidInvoiceCount(12);
        summary.setPendingVendorPaymentCount(8);
        
        return summary;
    }
}
