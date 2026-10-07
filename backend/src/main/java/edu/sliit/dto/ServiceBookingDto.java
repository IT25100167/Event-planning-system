package edu.sliit.dto;

import edu.sliit.entity.BookingStatus;
import edu.sliit.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceBookingDto {
    private Integer id;
    private Integer serviceId;
    private Integer eventCoordinatorId;
    private LocalDate bookingDate;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private String communicationNotes;
}
