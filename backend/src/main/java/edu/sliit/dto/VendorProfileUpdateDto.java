package edu.sliit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileUpdateDto {
    private String name;
    private String phoneNum;
    private String email;
}
