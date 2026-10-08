package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorAvailabilityDto {
    private Integer id;
    private Integer vendorId;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean blocked;
}
