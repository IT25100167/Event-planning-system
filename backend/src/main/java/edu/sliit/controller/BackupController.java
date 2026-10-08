package edu.sliit.controller;

import edu.sliit.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/backup")
@RequiredArgsConstructor
public class BackupController {

    private final BackupService backupService;

    @PostMapping("/create")
    public ResponseEntity<String> createBackup() {

        String backupPath = backupService.createManualBackup();

        return ResponseEntity.ok(
                "Backup created successfully: " + backupPath
        );
    }
    @GetMapping("/restore")
    public ResponseEntity<String> restoreBackup(
            @RequestParam String fileName) {

        String result = backupService.restoreBackup(fileName);

        return ResponseEntity.ok(result);
    }
}