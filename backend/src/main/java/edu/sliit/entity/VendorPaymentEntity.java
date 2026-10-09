package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String vendorPaymentId;

    @Column(nullable = false)
    private Integer eventId;

    @Column(nullable = false)
    private Integer vendorId;

    @Column(length = 100)
    private String serviceDescription;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    private LocalDate dueDate;
    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VendorPaymentStatus status = VendorPaymentStatus.PENDING;

    @Column(length = 100)
    private String paymentReference;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
