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
    private String name;
    private String category;
    private Integer capacity;
    private String description;
    private Double price;
}
