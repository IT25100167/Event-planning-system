package edu.sliit.dto.request;

import edu.sliit.entity.VendorPaymentStatus;
import lombok.Data;

@Data
public class UpdateVendorPaymentStatusRequestDTO {
    private VendorPaymentStatus status;
    private String paymentReference;
}
