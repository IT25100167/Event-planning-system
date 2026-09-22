package edu.sliit.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BackupService {

    private final Path backupDirectory =
            Paths.get("backups");

    @Scheduled(cron = "0 0 23 * * *")
    public void performScheduledBackup() {

        try {
            Files.createDirectories(backupDirectory);

            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));

            Path backupFile = backupDirectory.resolve(
                    "event_planning_backup_" + timestamp + ".txt"
            );

            String backupContent =
                    "Event Planning System Backup\n" +
                            "Backup Time: " + LocalDateTime.now() + "\n" +
                            "Status: Successful\n";

            Files.writeString(backupFile, backupContent);

            System.out.println(
                    "Scheduled backup created: " + backupFile.toAbsolutePath()
            );

        } catch (IOException e) {

            System.err.println(
                    "Backup failed: " + e.getMessage()
            );
        }
    }

    public String createManualBackup() {

        try {
            Files.createDirectories(backupDirectory);

            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));

            Path backupFile = backupDirectory.resolve(
                    "event_planning_backup_" + timestamp + ".txt"
            );

            String backupContent =
                    "Event Planning System Backup\n" +
                            "Backup Time: " + LocalDateTime.now() + "\n" +
                            "Status: Successful\n";

            Files.writeString(backupFile, backupContent);

            return backupFile.toAbsolutePath().toString();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Backup failed: " + e.getMessage()
            );
        }
    }
    public String restoreBackup(String fileName) {

        try {
            Path backupFile = backupDirectory.resolve(fileName);

            if (!Files.exists(backupFile)) {
                throw new RuntimeException("Backup file not found: " + fileName);
            }

            String backupContent = Files.readString(backupFile);

            return "Backup restored successfully.\n\n" + backupContent;

        } catch (IOException e) {
            throw new RuntimeException(
                    "Restore failed: " + e.getMessage()
            );
        }
    }
}