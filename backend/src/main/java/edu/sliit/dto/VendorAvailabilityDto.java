package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorAvailabilityDto {
    private Integer id;
    private Integer vendorId;
    private LocalDate date;
    private Boolean isAvailable;
}
