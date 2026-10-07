package edu.sliit.service;

import edu.sliit.dto.request.*;
import edu.sliit.dto.response.*;
import edu.sliit.entity.TransactionType;
import edu.sliit.entity.VendorPaymentStatus;

import java.util.List;

public interface FinanceService {
    QuotationResponseDTO createQuotation(CreateQuotationRequestDTO request);
    List<QuotationResponseDTO> getQuotations(String bookingId);
    QuotationResponseDTO getQuotation(String quotationId);
    QuotationResponseDTO updateQuotationStatus(String quotationId, UpdateQuotationStatusRequestDTO request);

    InvoiceResponseDTO createInvoice(CreateInvoiceRequestDTO request);
    List<InvoiceResponseDTO> getInvoices(String bookingId, String paymentStatus);
    InvoiceResponseDTO getInvoice(String invoiceId);

    CustomerPaymentResponseDTO recordCustomerPayment(String invoiceId, RecordCustomerPaymentRequestDTO request);
    List<CustomerPaymentResponseDTO> getCustomerPayments(String invoiceId);

    EventBudgetResponseDTO createBudget(CreateEventBudgetRequestDTO request);
    EventBudgetResponseDTO updateBudget(Integer eventId, UpdateEventBudgetRequestDTO request);
    EventBudgetResponseDTO getBudget(Integer eventId);

    VendorPaymentResponseDTO createVendorPayment(CreateVendorPaymentRequestDTO request);
    VendorPaymentResponseDTO updateVendorPaymentStatus(String vendorPaymentId, UpdateVendorPaymentStatusRequestDTO request);
    List<VendorPaymentResponseDTO> getVendorPayments(Integer eventId, Integer vendorId, VendorPaymentStatus status);

    List<FinancialRecordResponseDTO> getFinancialRecords(TransactionType type, String bookingId, Integer eventId);
    FinancialSummaryResponseDTO getFinancialSummary();
}
