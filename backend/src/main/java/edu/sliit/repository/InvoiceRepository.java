package edu.sliit.repository;

import edu.sliit.entity.InvoiceEntity;
import edu.sliit.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, Long> {
    Optional<InvoiceEntity> findByInvoiceId(String invoiceId);
    List<InvoiceEntity> findByBookingIdOrderByIssuedDateDesc(String bookingId);
    List<InvoiceEntity> findByPaymentStatus(PaymentStatus paymentStatus);
    long countByPaymentStatus(PaymentStatus paymentStatus);
}
