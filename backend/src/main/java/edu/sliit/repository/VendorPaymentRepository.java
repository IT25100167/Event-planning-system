package edu.sliit.repository;

import edu.sliit.entity.VendorPaymentEntity;
import edu.sliit.entity.VendorPaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorPaymentRepository extends JpaRepository<VendorPaymentEntity, Long> {
    Optional<VendorPaymentEntity> findByVendorPaymentId(String vendorPaymentId);
    List<VendorPaymentEntity> findByEventIdOrderByCreatedAtDesc(Integer eventId);
    List<VendorPaymentEntity> findByVendorIdOrderByCreatedAtDesc(Integer vendorId);
    List<VendorPaymentEntity> findByStatus(VendorPaymentStatus status);
    long countByStatus(VendorPaymentStatus status);
}
