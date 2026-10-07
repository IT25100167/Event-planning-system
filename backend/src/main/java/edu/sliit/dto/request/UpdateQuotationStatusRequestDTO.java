package edu.sliit.dto.request;

import edu.sliit.entity.QuotationStatus;
import lombok.Data;

@Data
public class UpdateQuotationStatusRequestDTO {
    private QuotationStatus status;
}
