package edu.sliit.service;

public interface InvoicePdfService {
    byte[] generateInvoicePdf(String invoiceId);
}
