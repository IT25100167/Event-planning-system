package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String invoiceId;

    @Column(nullable = false, length = 64)
    private String bookingId;

    @Column(nullable = false, length = 120)
    private String customerEmail;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal baseTotal;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercent;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal discountAmount;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal taxRate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal finalAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal outstandingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime issuedDate;

    private LocalDate dueDate;

    @PrePersist
    protected void onCreate() {
        if (issuedDate == null) issuedDate = LocalDateTime.now();
        if (paidAmount == null) paidAmount = BigDecimal.ZERO;
        if (outstandingAmount == null) outstandingAmount = finalAmount;
    }
}
