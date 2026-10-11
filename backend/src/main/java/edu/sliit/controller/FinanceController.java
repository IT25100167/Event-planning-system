package edu.sliit.controller;

import edu.sliit.dto.response.FinancialSummaryDTO;
import edu.sliit.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/summary")
    public ResponseEntity<FinancialSummaryDTO> getFinancialSummary() {
        FinancialSummaryDTO summary = financeService.getFinancialSummary();
        return ResponseEntity.ok(summary);
    }
}
