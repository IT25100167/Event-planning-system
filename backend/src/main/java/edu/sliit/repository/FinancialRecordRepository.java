package edu.sliit.repository;

import edu.sliit.entity.FinancialRecordEntity;
import edu.sliit.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinancialRecordRepository extends JpaRepository<FinancialRecordEntity, Long> {
    List<FinancialRecordEntity> findByTypeOrderByTransactionDateDesc(TransactionType type);
    List<FinancialRecordEntity> findByBookingIdOrderByTransactionDateDesc(String bookingId);
    List<FinancialRecordEntity> findByEventIdOrderByTransactionDateDesc(Integer eventId);
}
