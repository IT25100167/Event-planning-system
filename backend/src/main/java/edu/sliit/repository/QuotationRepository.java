package edu.sliit.repository;

import edu.sliit.entity.QuotationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<QuotationEntity, Long> {
    Optional<QuotationEntity> findByQuotationId(String quotationId);
    List<QuotationEntity> findByBookingIdOrderByCreatedAtDesc(String bookingId);
}
