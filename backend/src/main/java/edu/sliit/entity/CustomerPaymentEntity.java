package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String paymentId;

    @Column(nullable = false, length = 32)
    private String invoiceId;

    @Column(nullable = false, length = 64)
    private String bookingId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 40)
    private String paymentMethod;

    @Column(length = 100)
    private String reference;

    @Column(nullable = false, updatable = false)
    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        if (paidAt == null) paidAt = LocalDateTime.now();
    }
}
