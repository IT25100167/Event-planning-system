package edu.sliit.repository;

import edu.sliit.entity.ServiceBookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceBookingRepository extends JpaRepository<ServiceBookingEntity, Integer> {
    List<ServiceBookingEntity> findByServiceVendorUserId(Integer vendorId);
    List<ServiceBookingEntity> findByEventCoordinatorUserId(Integer coordinatorId);
    boolean existsByServiceId(Integer serviceId);
}
