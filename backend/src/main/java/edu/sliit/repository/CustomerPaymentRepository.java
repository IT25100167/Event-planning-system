package edu.sliit.repository;

import edu.sliit.entity.CustomerPaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerPaymentRepository extends JpaRepository<CustomerPaymentEntity, Long> {
    List<CustomerPaymentEntity> findByInvoiceIdOrderByPaidAtDesc(String invoiceId);
}
