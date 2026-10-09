package edu.sliit.controller;

import edu.sliit.dto.request.*;
import edu.sliit.dto.response.*;
import edu.sliit.entity.TransactionType;
import edu.sliit.entity.VendorPaymentStatus;
import edu.sliit.service.FinanceService;
import edu.sliit.service.InvoicePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FinanceController {

    private final FinanceService financeService;
    private final InvoicePdfService invoicePdfService;

    @PostMapping("/quotations")
    public ResponseEntity<QuotationResponseDTO> createQuotation(@RequestBody CreateQuotationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.createQuotation(request));
    }

    @GetMapping("/quotations")
    public ResponseEntity<List<QuotationResponseDTO>> getQuotations(@RequestParam(required = false) String bookingId) {
        return ResponseEntity.ok(financeService.getQuotations(bookingId));
    }

    @GetMapping("/quotations/{quotationId}")
    public ResponseEntity<QuotationResponseDTO> getQuotation(@PathVariable String quotationId) {
        return ResponseEntity.ok(financeService.getQuotation(quotationId));
    }

    @PatchMapping("/quotations/{quotationId}/status")
    public ResponseEntity<QuotationResponseDTO> updateQuotationStatus(
            @PathVariable String quotationId,
            @RequestBody UpdateQuotationStatusRequestDTO request) {
        return ResponseEntity.ok(financeService.updateQuotationStatus(quotationId, request));
    }

    @PostMapping("/invoices")
    public ResponseEntity<InvoiceResponseDTO> createInvoice(@RequestBody CreateInvoiceRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.createInvoice(request));
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoices(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String paymentStatus) {
        return ResponseEntity.ok(financeService.getInvoices(bookingId, paymentStatus));
    }

    @GetMapping("/invoices/{invoiceId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoice(@PathVariable String invoiceId) {
        return ResponseEntity.ok(financeService.getInvoice(invoiceId));
    }

    @PostMapping("/invoices/{invoiceId}/payments")
    public ResponseEntity<CustomerPaymentResponseDTO> recordCustomerPayment(
            @PathVariable String invoiceId,
            @RequestBody RecordCustomerPaymentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.recordCustomerPayment(invoiceId, request));
    }

    @GetMapping("/invoices/{invoiceId}/payments")
    public ResponseEntity<List<CustomerPaymentResponseDTO>> getCustomerPayments(@PathVariable String invoiceId) {
        return ResponseEntity.ok(financeService.getCustomerPayments(invoiceId));
    }

    @GetMapping("/invoices/{invoiceId}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable String invoiceId) {
        byte[] pdf = invoicePdfService.generateInvoicePdf(invoiceId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("Invoice-" + invoiceId + ".pdf").build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @PostMapping("/budgets")
    public ResponseEntity<EventBudgetResponseDTO> createBudget(@RequestBody CreateEventBudgetRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.createBudget(request));
    }

    @GetMapping("/budgets/{eventId}")
    public ResponseEntity<EventBudgetResponseDTO> getBudget(@PathVariable Integer eventId) {
        return ResponseEntity.ok(financeService.getBudget(eventId));
    }

    @PutMapping("/budgets/{eventId}")
    public ResponseEntity<EventBudgetResponseDTO> updateBudget(
            @PathVariable Integer eventId,
            @RequestBody UpdateEventBudgetRequestDTO request) {
        return ResponseEntity.ok(financeService.updateBudget(eventId, request));
    }

    @PostMapping("/vendor-payments")
    public ResponseEntity<VendorPaymentResponseDTO> createVendorPayment(@RequestBody CreateVendorPaymentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.createVendorPayment(request));
    }

    @PatchMapping("/vendor-payments/{vendorPaymentId}/status")
    public ResponseEntity<VendorPaymentResponseDTO> updateVendorPaymentStatus(
            @PathVariable String vendorPaymentId,
            @RequestBody UpdateVendorPaymentStatusRequestDTO request) {
        return ResponseEntity.ok(financeService.updateVendorPaymentStatus(vendorPaymentId, request));
    }

    @GetMapping("/vendor-payments")
    public ResponseEntity<List<VendorPaymentResponseDTO>> getVendorPayments(
            @RequestParam(required = false) Integer eventId,
            @RequestParam(required = false) Integer vendorId,
            @RequestParam(required = false) VendorPaymentStatus status) {
        return ResponseEntity.ok(financeService.getVendorPayments(eventId, vendorId, status));
    }

    @GetMapping("/records")
    public ResponseEntity<List<FinancialRecordResponseDTO>> getFinancialRecords(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) Integer eventId) {
        return ResponseEntity.ok(financeService.getFinancialRecords(type, bookingId, eventId));
    }

    @GetMapping("/summary")
    public ResponseEntity<FinancialSummaryResponseDTO> getFinancialSummary() {
        return ResponseEntity.ok(financeService.getFinancialSummary());
    }
}
