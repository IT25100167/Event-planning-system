package edu.sliit.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import edu.sliit.entity.InvoiceEntity;
import edu.sliit.exception.FinanceNotFoundException;
import edu.sliit.repository.InvoiceRepository;
import edu.sliit.service.InvoicePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;

@Service
@RequiredArgsConstructor
public class InvoicePdfServiceImpl implements InvoicePdfService {

    private final InvoiceRepository invoiceRepository;
    private static final DecimalFormat MONEY = new DecimalFormat("#,##0.00");

    @Override
    public byte[] generateInvoicePdf(String invoiceId) {
        InvoiceEntity invoice = invoiceRepository.findByInvoiceId(invoiceId)
                .orElseThrow(() -> new FinanceNotFoundException("Invoice not found: " + invoiceId));

        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, output);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headingFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10);

            Paragraph company = new Paragraph("Ceylon Celebrations (Pvt) Ltd", titleFont);
            company.setAlignment(Element.ALIGN_CENTER);
            document.add(company);

            Paragraph invoiceTitle = new Paragraph("OFFICIAL TAX INVOICE", headingFont);
            invoiceTitle.setAlignment(Element.ALIGN_CENTER);
            invoiceTitle.setSpacingAfter(18);
            document.add(invoiceTitle);

            PdfPTable meta = new PdfPTable(2);
            meta.setWidthPercentage(100);
            meta.setWidths(new float[]{1, 2});
            addRow(meta, "Invoice ID", invoice.getInvoiceId(), headingFont, normalFont);
            addRow(meta, "Booking ID", invoice.getBookingId(), headingFont, normalFont);
            addRow(meta, "Customer", invoice.getCustomerEmail(), headingFont, normalFont);
            addRow(meta, "Issued", String.valueOf(invoice.getIssuedDate()), headingFont, normalFont);
            addRow(meta, "Due Date", String.valueOf(invoice.getDueDate()), headingFont, normalFont);
            addRow(meta, "Payment Status", String.valueOf(invoice.getPaymentStatus()), headingFont, normalFont);
            meta.setSpacingAfter(18);
            document.add(meta);

            PdfPTable totals = new PdfPTable(2);
            totals.setWidthPercentage(100);
            totals.setWidths(new float[]{2, 1});
            addMoneyRow(totals, "Base Amount", invoice.getBaseTotal(), normalFont);
            addMoneyRow(totals, "Discount (" + invoice.getDiscountPercent() + "%)", invoice.getDiscountAmount().negate(), normalFont);
            addMoneyRow(totals, "Tax (" + invoice.getTaxRate() + "%)", invoice.getTaxAmount(), normalFont);
            addMoneyRow(totals, "Total Payable", invoice.getFinalAmount(), headingFont);
            addMoneyRow(totals, "Paid", invoice.getPaidAmount(), normalFont);
            addMoneyRow(totals, "Outstanding", invoice.getOutstandingAmount(), headingFont);
            document.add(totals);

            Paragraph footer = new Paragraph("Thank you for choosing Ceylon Celebrations.", normalFont);
            footer.setSpacingBefore(24);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return output.toByteArray();
        } catch (DocumentException ex) {
            throw new IllegalStateException("Could not generate invoice PDF.", ex);
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell left = new PdfPCell(new Phrase(label, labelFont));
        PdfPCell right = new PdfPCell(new Phrase(value == null ? "-" : value, valueFont));
        left.setPadding(7);
        right.setPadding(7);
        table.addCell(left);
        table.addCell(right);
    }

    private void addMoneyRow(PdfPTable table, String label, BigDecimal value, Font font) {
        PdfPCell left = new PdfPCell(new Phrase(label, font));
        PdfPCell right = new PdfPCell(new Phrase("LKR " + MONEY.format(value), font));
        right.setHorizontalAlignment(Element.ALIGN_RIGHT);
        left.setPadding(8);
        right.setPadding(8);
        table.addCell(left);
        table.addCell(right);
    }
}
