package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_budgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventBudgetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer eventId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal allocatedBudget;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal actualSpend = BigDecimal.ZERO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (actualSpend == null) actualSpend = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
