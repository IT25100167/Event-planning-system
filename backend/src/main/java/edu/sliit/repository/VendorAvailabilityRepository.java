package edu.sliit.repository;

import edu.sliit.entity.VendorAvailabilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VendorAvailabilityRepository extends JpaRepository<VendorAvailabilityEntity, Integer> {
    List<VendorAvailabilityEntity> findByVendorUserId(Integer vendorId);
    Optional<VendorAvailabilityEntity> findByVendorUserIdAndSlotDate(Integer vendorId, LocalDate slotDate);
}
