package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vendor_availability")
public class VendorAvailabilityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private UserEntity vendor;

    @Column(name = "available_date", nullable = false)
    private LocalDate date;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;
}
