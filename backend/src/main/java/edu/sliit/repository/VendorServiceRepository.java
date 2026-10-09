package edu.sliit.repository;

import edu.sliit.entity.VendorServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorServiceRepository extends JpaRepository<VendorServiceEntity, Integer> {
    List<VendorServiceEntity> findByVendorUserId(Integer vendorId);
}
