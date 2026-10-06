package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorServiceDto {
    private Integer id;
    private Integer vendorId;
    private String serviceName;
    private String description;
    private Double price;
}
