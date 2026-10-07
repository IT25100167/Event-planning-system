package edu.sliit.service.impl;

import edu.sliit.dto.request.*;
import edu.sliit.dto.response.*;
import edu.sliit.entity.*;
import edu.sliit.exception.FinanceNotFoundException;
import edu.sliit.exception.FinanceValidationException;
import edu.sliit.repository.*;
import edu.sliit.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FinanceServiceImpl implements FinanceService {

    private static final BigDecimal TAX_RATE = new BigDecimal("15.00");
    private static final BigDecimal MAX_DISCOUNT_PERCENT = new BigDecimal("20.00");
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100.00");

    private final QuotationRepository quotationRepository;
    private final InvoiceRepository invoiceRepository;
    private final CustomerPaymentRepository customerPaymentRepository;
    private final VendorPaymentRepository vendorPaymentRepository;
    private final EventBudgetRepository eventBudgetRepository;
    private final FinancialRecordRepository financialRecordRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    public QuotationResponseDTO createQuotation(CreateQuotationRequestDTO request) {
        validateText(request.getBookingId(), "Booking ID");
        validateMoney(request.getSubtotal(), "Subtotal");
        BigDecimal discountPercent = defaultZero(request.getDiscountPercent());
        validateDiscount(discountPercent);

        BigDecimal subtotal = money(request.getSubtotal());
        BigDecimal discountAmount = percentageOf(subtotal, discountPercent);
        BigDecimal taxableAmount = subtotal.subtract(discountAmount);
        BigDecimal taxAmount = percentageOf(taxableAmount, TAX_RATE);
        BigDecimal estimatedTotal = money(taxableAmount.add(taxAmount));

        QuotationEntity quotation = QuotationEntity.builder()
                .quotationId(generateId("QUO"))
                .bookingId(request.getBookingId().trim())
                .packageId(trimToNull(request.getPackageId()))
                .subtotal(subtotal)
                .discountPercent(money(discountPercent))
                .discountAmount(discountAmount)
                .taxRate(TAX_RATE)
                .taxAmount(taxAmount)
                .estimatedTotal(estimatedTotal)
                .status(QuotationStatus.DRAFT)
                .build();

        return toQuotationResponse(quotationRepository.save(quotation));
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotationResponseDTO> getQuotations(String bookingId) {
        List<QuotationEntity> quotations = hasText(bookingId)
                ? quotationRepository.findByBookingIdOrderByCreatedAtDesc(bookingId.trim())
                : quotationRepository.findAll().stream()
                    .sorted(Comparator.comparing(QuotationEntity::getCreatedAt).reversed())
                    .toList();
        return quotations.stream().map(this::toQuotationResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public QuotationResponseDTO getQuotation(String quotationId) {
        return toQuotationResponse(findQuotation(quotationId));
    }

    @Override
    public QuotationResponseDTO updateQuotationStatus(String quotationId, UpdateQuotationStatusRequestDTO request) {
        if (request.getStatus() == null) {
            throw new FinanceValidationException("Quotation status is required.");
        }
        QuotationEntity quotation = findQuotation(quotationId);
        quotation.setStatus(request.getStatus());
        return toQuotationResponse(quotationRepository.save(quotation));
    }

    @Override
    public InvoiceResponseDTO createInvoice(CreateInvoiceRequestDTO request) {
        validateText(request.getBookingId(), "Booking ID");
        validateText(request.getCustomerEmail(), "Customer email");
        if (!request.getCustomerEmail().contains("@")) {
            throw new FinanceValidationException("Customer email is not valid.");
        }
        validateMoney(request.getBaseAmount(), "Base amount");
        BigDecimal discountPercent = defaultZero(request.getDiscountPercent());
        validateDiscount(discountPercent);

        BigDecimal baseAmount = money(request.getBaseAmount());
        BigDecimal discountAmount = percentageOf(baseAmount, discountPercent);
        BigDecimal taxableAmount = baseAmount.subtract(discountAmount);
        BigDecimal taxAmount = percentageOf(taxableAmount, TAX_RATE);
        BigDecimal finalAmount = money(taxableAmount.add(taxAmount));

        LocalDate dueDate = request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusDays(14);
        if (dueDate.isBefore(LocalDate.now())) {
            throw new FinanceValidationException("Invoice due date cannot be in the past.");
        }

        InvoiceEntity invoice = InvoiceEntity.builder()
                .invoiceId(generateId("INV"))
                .bookingId(request.getBookingId().trim())
                .customerEmail(request.getCustomerEmail().trim())
                .baseTotal(baseAmount)
                .discountPercent(money(discountPercent))
                .discountAmount(discountAmount)
                .taxRate(TAX_RATE)
                .taxAmount(taxAmount)
                .finalAmount(finalAmount)
                .paidAmount(BigDecimal.ZERO.setScale(2))
                .outstandingAmount(finalAmount)
                .paymentStatus(PaymentStatus.PENDING)
                .dueDate(dueDate)
                .build();

        return toInvoiceResponse(invoiceRepository.save(invoice));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDTO> getInvoices(String bookingId, String paymentStatus) {
        List<InvoiceEntity> invoices;
        if (hasText(bookingId)) {
            invoices = invoiceRepository.findByBookingIdOrderByIssuedDateDesc(bookingId.trim());
        } else if (hasText(paymentStatus)) {
            PaymentStatus status;
            try {
                status = PaymentStatus.valueOf(paymentStatus.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new FinanceValidationException("Invalid payment status: " + paymentStatus);
            }
            if (status == PaymentStatus.OVERDUE) {
                invoices = invoiceRepository.findAll().stream()
                        .filter(i -> i.getOutstandingAmount().compareTo(BigDecimal.ZERO) > 0)
                        .filter(i -> i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now()))
                        .toList();
            } else {
                invoices = invoiceRepository.findByPaymentStatus(status);
            }
        } else {
            invoices = invoiceRepository.findAll().stream()
                    .sorted(Comparator.comparing(InvoiceEntity::getIssuedDate).reversed())
                    .toList();
        }
        return invoices.stream().map(this::toInvoiceResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDTO getInvoice(String invoiceId) {
        return toInvoiceResponse(findInvoice(invoiceId));
    }

    @Override
    public CustomerPaymentResponseDTO recordCustomerPayment(String invoiceId, RecordCustomerPaymentRequestDTO request) {
        validateMoney(request.getAmount(), "Payment amount");
        validateText(request.getPaymentMethod(), "Payment method");

        InvoiceEntity invoice = findInvoice(invoiceId);
        if (invoice.getPaymentStatus() == PaymentStatus.CANCELLED) {
            throw new FinanceValidationException("Payments cannot be recorded against a cancelled invoice.");
        }
        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new FinanceValidationException("This invoice is already fully paid.");
        }

        BigDecimal amount = money(request.getAmount());
        if (amount.compareTo(invoice.getOutstandingAmount()) > 0) {
            throw new FinanceValidationException("Payment amount cannot exceed the outstanding invoice balance.");
        }

        CustomerPaymentEntity payment = CustomerPaymentEntity.builder()
                .paymentId(generateId("PAY"))
                .invoiceId(invoice.getInvoiceId())
                .bookingId(invoice.getBookingId())
                .amount(amount)
                .paymentMethod(request.getPaymentMethod().trim())
                .reference(trimToNull(request.getReference()))
                .build();
        CustomerPaymentEntity savedPayment = customerPaymentRepository.save(payment);

        BigDecimal newPaidAmount = money(invoice.getPaidAmount().add(amount));
        BigDecimal outstanding = money(invoice.getFinalAmount().subtract(newPaidAmount));
        invoice.setPaidAmount(newPaidAmount);
        invoice.setOutstandingAmount(outstanding);
        invoice.setPaymentStatus(outstanding.compareTo(BigDecimal.ZERO) == 0
                ? PaymentStatus.PAID
                : PaymentStatus.PARTIALLY_PAID);
        invoiceRepository.save(invoice);

        financialRecordRepository.save(FinancialRecordEntity.builder()
                .transactionId(generateId("TXN"))
                .bookingId(invoice.getBookingId())
                .type(TransactionType.CUSTOMER_PAYMENT)
                .amount(amount)
                .direction("CREDIT")
                .reference(savedPayment.getPaymentId())
                .build());

        return toCustomerPaymentResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerPaymentResponseDTO> getCustomerPayments(String invoiceId) {
        findInvoice(invoiceId);
        return customerPaymentRepository.findByInvoiceIdOrderByPaidAtDesc(invoiceId).stream()
                .map(this::toCustomerPaymentResponse)
                .toList();
    }

    @Override
    public EventBudgetResponseDTO createBudget(CreateEventBudgetRequestDTO request) {
        if (request.getEventId() == null) throw new FinanceValidationException("Event ID is required.");
        validateExistingEvent(request.getEventId());
        validateMoney(request.getAllocatedBudget(), "Allocated budget");
        if (eventBudgetRepository.existsByEventId(request.getEventId())) {
            throw new FinanceValidationException("A budget already exists for event " + request.getEventId() + ".");
        }

        EventBudgetEntity budget = EventBudgetEntity.builder()
                .eventId(request.getEventId())
                .allocatedBudget(money(request.getAllocatedBudget()))
                .actualSpend(money(vendorPaymentRepository.findByEventIdOrderByCreatedAtDesc(request.getEventId()).stream()
                        .filter(p -> p.getStatus() == VendorPaymentStatus.PAID)
                        .map(VendorPaymentEntity::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)))
                .build();
        return toBudgetResponse(eventBudgetRepository.save(budget));
    }

    @Override
    public EventBudgetResponseDTO updateBudget(Integer eventId, UpdateEventBudgetRequestDTO request) {
        validateExistingEvent(eventId);
        validateMoney(request.getAllocatedBudget(), "Allocated budget");
        EventBudgetEntity budget = findBudget(eventId);
        budget.setAllocatedBudget(money(request.getAllocatedBudget()));
        return toBudgetResponse(eventBudgetRepository.save(budget));
    }

    @Override
    @Transactional(readOnly = true)
    public EventBudgetResponseDTO getBudget(Integer eventId) {
        validateExistingEvent(eventId);
        return toBudgetResponse(findBudget(eventId));
    }

    @Override
    public VendorPaymentResponseDTO createVendorPayment(CreateVendorPaymentRequestDTO request) {
        if (request.getEventId() == null) throw new FinanceValidationException("Event ID is required.");
        if (request.getVendorId() == null) throw new FinanceValidationException("Vendor ID is required.");
        validateExistingEvent(request.getEventId());
        validateVendorUser(request.getVendorId());
        validateMoney(request.getAmount(), "Vendor payment amount");

        VendorPaymentEntity payment = VendorPaymentEntity.builder()
                .vendorPaymentId(generateId("VPAY"))
                .eventId(request.getEventId())
                .vendorId(request.getVendorId())
                .serviceDescription(trimToNull(request.getServiceDescription()))
                .amount(money(request.getAmount()))
                .dueDate(request.getDueDate())
                .status(VendorPaymentStatus.PENDING)
                .build();
        return toVendorPaymentResponse(vendorPaymentRepository.save(payment));
    }

    @Override
    public VendorPaymentResponseDTO updateVendorPaymentStatus(String vendorPaymentId, UpdateVendorPaymentStatusRequestDTO request) {
        if (request.getStatus() == null) {
            throw new FinanceValidationException("Vendor payment status is required.");
        }
        VendorPaymentEntity payment = findVendorPayment(vendorPaymentId);
        VendorPaymentStatus previousStatus = payment.getStatus();

        if (previousStatus == VendorPaymentStatus.PAID && request.getStatus() != VendorPaymentStatus.PAID) {
            throw new FinanceValidationException("A paid vendor payment cannot be moved back to another status.");
        }

        payment.setStatus(request.getStatus());
        payment.setPaymentReference(trimToNull(request.getPaymentReference()));

        if (request.getStatus() == VendorPaymentStatus.PAID && previousStatus != VendorPaymentStatus.PAID) {
            payment.setPaidDate(LocalDate.now());

            eventBudgetRepository.findByEventId(payment.getEventId()).ifPresent(budget -> {
                budget.setActualSpend(money(budget.getActualSpend().add(payment.getAmount())));
                eventBudgetRepository.save(budget);
            });

            financialRecordRepository.save(FinancialRecordEntity.builder()
                    .transactionId(generateId("TXN"))
                    .eventId(payment.getEventId())
                    .type(TransactionType.VENDOR_PAYMENT)
                    .amount(payment.getAmount())
                    .direction("DEBIT")
                    .reference(payment.getVendorPaymentId())
                    .build());
        }

        return toVendorPaymentResponse(vendorPaymentRepository.save(payment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorPaymentResponseDTO> getVendorPayments(Integer eventId, Integer vendorId, VendorPaymentStatus status) {
        List<VendorPaymentEntity> payments;
        if (eventId != null) {
            payments = vendorPaymentRepository.findByEventIdOrderByCreatedAtDesc(eventId);
        } else if (vendorId != null) {
            payments = vendorPaymentRepository.findByVendorIdOrderByCreatedAtDesc(vendorId);
        } else if (status != null) {
            payments = vendorPaymentRepository.findByStatus(status);
        } else {
            payments = vendorPaymentRepository.findAll().stream()
                    .sorted(Comparator.comparing(VendorPaymentEntity::getCreatedAt).reversed())
                    .toList();
        }
        return payments.stream().map(this::toVendorPaymentResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FinancialRecordResponseDTO> getFinancialRecords(TransactionType type, String bookingId, Integer eventId) {
        List<FinancialRecordEntity> records;
        if (type != null) {
            records = financialRecordRepository.findByTypeOrderByTransactionDateDesc(type);
        } else if (hasText(bookingId)) {
            records = financialRecordRepository.findByBookingIdOrderByTransactionDateDesc(bookingId.trim());
        } else if (eventId != null) {
            records = financialRecordRepository.findByEventIdOrderByTransactionDateDesc(eventId);
        } else {
            records = financialRecordRepository.findAll().stream()
                    .sorted(Comparator.comparing(FinancialRecordEntity::getTransactionDate).reversed())
                    .toList();
        }
        return records.stream().map(this::toFinancialRecordResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FinancialSummaryResponseDTO getFinancialSummary() {
        BigDecimal revenue = sumRecords(TransactionType.CUSTOMER_PAYMENT);
        BigDecimal vendorExpenses = sumRecords(TransactionType.VENDOR_PAYMENT);
        BigDecimal outstandingReceivables = invoiceRepository.findAll().stream()
                .filter(i -> i.getPaymentStatus() != PaymentStatus.CANCELLED)
                .map(InvoiceEntity::getOutstandingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal outstandingVendorPayables = vendorPaymentRepository.findByStatus(VendorPaymentStatus.PENDING).stream()
                .map(VendorPaymentEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return FinancialSummaryResponseDTO.builder()
                .totalCustomerRevenue(money(revenue))
                .totalVendorExpenses(money(vendorExpenses))
                .outstandingCustomerReceivables(money(outstandingReceivables))
                .outstandingVendorPayables(money(outstandingVendorPayables))
                .netCashFlow(money(revenue.subtract(vendorExpenses)))
                .invoiceCount(invoiceRepository.count())
                .paidInvoiceCount(invoiceRepository.countByPaymentStatus(PaymentStatus.PAID))
                .pendingVendorPaymentCount(vendorPaymentRepository.countByStatus(VendorPaymentStatus.PENDING))
                .build();
    }

    private BigDecimal sumRecords(TransactionType type) {
        return financialRecordRepository.findByTypeOrderByTransactionDateDesc(type).stream()
                .map(FinancialRecordEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private QuotationEntity findQuotation(String quotationId) {
        return quotationRepository.findByQuotationId(quotationId)
                .orElseThrow(() -> new FinanceNotFoundException("Quotation not found: " + quotationId));
    }

    private InvoiceEntity findInvoice(String invoiceId) {
        return invoiceRepository.findByInvoiceId(invoiceId)
                .orElseThrow(() -> new FinanceNotFoundException("Invoice not found: " + invoiceId));
    }

    private VendorPaymentEntity findVendorPayment(String vendorPaymentId) {
        return vendorPaymentRepository.findByVendorPaymentId(vendorPaymentId)
                .orElseThrow(() -> new FinanceNotFoundException("Vendor payment not found: " + vendorPaymentId));
    }

    private EventBudgetEntity findBudget(Integer eventId) {
        return eventBudgetRepository.findByEventId(eventId)
                .orElseThrow(() -> new FinanceNotFoundException("Budget not found for event: " + eventId));
    }

    private QuotationResponseDTO toQuotationResponse(QuotationEntity q) {
        return QuotationResponseDTO.builder()
                .quotationId(q.getQuotationId()).bookingId(q.getBookingId()).packageId(q.getPackageId())
                .subtotal(q.getSubtotal()).discountPercent(q.getDiscountPercent()).discountAmount(q.getDiscountAmount())
                .taxRate(q.getTaxRate()).taxAmount(q.getTaxAmount()).estimatedTotal(q.getEstimatedTotal())
                .status(q.getStatus()).createdAt(q.getCreatedAt()).updatedAt(q.getUpdatedAt()).build();
    }

    private InvoiceResponseDTO toInvoiceResponse(InvoiceEntity i) {
        PaymentStatus displayedStatus = i.getPaymentStatus();
        if (displayedStatus == PaymentStatus.PENDING && i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now())) {
            displayedStatus = PaymentStatus.OVERDUE;
        }
        return InvoiceResponseDTO.builder()
                .invoiceId(i.getInvoiceId()).bookingId(i.getBookingId()).customerEmail(i.getCustomerEmail())
                .baseTotal(i.getBaseTotal()).discountPercent(i.getDiscountPercent()).discountAmount(i.getDiscountAmount())
                .taxRate(i.getTaxRate()).taxAmount(i.getTaxAmount()).finalAmount(i.getFinalAmount())
                .paidAmount(i.getPaidAmount()).outstandingAmount(i.getOutstandingAmount())
                .paymentStatus(displayedStatus).issuedDate(i.getIssuedDate()).dueDate(i.getDueDate()).build();
    }

    private CustomerPaymentResponseDTO toCustomerPaymentResponse(CustomerPaymentEntity p) {
        return CustomerPaymentResponseDTO.builder()
                .paymentId(p.getPaymentId()).invoiceId(p.getInvoiceId()).bookingId(p.getBookingId())
                .amount(p.getAmount()).paymentMethod(p.getPaymentMethod()).reference(p.getReference()).paidAt(p.getPaidAt()).build();
    }

    private EventBudgetResponseDTO toBudgetResponse(EventBudgetEntity b) {
        BigDecimal allocated = b.getAllocatedBudget();
        BigDecimal actual = b.getActualSpend();
        BigDecimal variance = money(allocated.subtract(actual));
        BigDecimal utilization = allocated.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO.setScale(2)
                : actual.multiply(ONE_HUNDRED).divide(allocated, 2, RoundingMode.HALF_UP);
        String status = utilization.compareTo(new BigDecimal("100")) >= 0 ? "OVER_BUDGET"
                : utilization.compareTo(new BigDecimal("90")) >= 0 ? "CRITICAL"
                : utilization.compareTo(new BigDecimal("75")) >= 0 ? "WARNING" : "ON_TRACK";
        return EventBudgetResponseDTO.builder()
                .eventId(b.getEventId()).allocatedBudget(allocated).actualSpend(actual).variance(variance)
                .utilizationPercentage(utilization).status(status).build();
    }

    private VendorPaymentResponseDTO toVendorPaymentResponse(VendorPaymentEntity p) {
        return VendorPaymentResponseDTO.builder()
                .vendorPaymentId(p.getVendorPaymentId()).eventId(p.getEventId()).vendorId(p.getVendorId())
                .serviceDescription(p.getServiceDescription()).amount(p.getAmount()).dueDate(p.getDueDate())
                .paidDate(p.getPaidDate()).status(p.getStatus()).paymentReference(p.getPaymentReference())
                .createdAt(p.getCreatedAt()).build();
    }

    private FinancialRecordResponseDTO toFinancialRecordResponse(FinancialRecordEntity r) {
        return FinancialRecordResponseDTO.builder()
                .transactionId(r.getTransactionId()).bookingId(r.getBookingId()).eventId(r.getEventId())
                .type(r.getType()).amount(r.getAmount()).direction(r.getDirection()).reference(r.getReference())
                .transactionDate(r.getTransactionDate()).build();
    }

    private void validateText(String value, String field) {
        if (!hasText(value)) throw new FinanceValidationException(field + " is required.");
    }

    private void validateMoney(BigDecimal value, String field) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new FinanceValidationException(field + " must be greater than 0.");
        }
    }

    private void validateDiscount(BigDecimal discount) {
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            throw new FinanceValidationException("Discount percentage cannot be negative.");
        }
        if (discount.compareTo(MAX_DISCOUNT_PERCENT) > 0) {
            throw new FinanceValidationException("Discount exceeds the 20% policy limit and requires administrator approval.");
        }
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal percentageOf(BigDecimal amount, BigDecimal percent) {
        return money(amount.multiply(percent).divide(ONE_HUNDRED, 4, RoundingMode.HALF_UP));
    }

    private BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String generateId(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String trimToNull(String value) {
        return hasText(value) ? value.trim() : null;
    }
    private void validateExistingEvent(Integer eventId) {
        if (eventId == null || !eventRepository.existsById(eventId)) {
            throw new FinanceValidationException("Event not found with ID: " + eventId);
        }
    }

    private void validateVendorUser(Integer vendorId) {
        UserEntity vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new FinanceValidationException("Vendor user not found with ID: " + vendorId));
        if (vendor.getRole() != Role.VENDOR) {
            throw new FinanceValidationException("User " + vendorId + " is not registered with the VENDOR role.");
        }
    }

}
