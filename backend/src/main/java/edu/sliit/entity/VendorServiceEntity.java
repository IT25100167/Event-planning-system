package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vendor_services")
public class VendorServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private UserEntity vendor;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private Double price;
}
