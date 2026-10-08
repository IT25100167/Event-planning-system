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
            Paths.get("backups").toAbsolutePath().normalize();

    private static final String MYSQL_BIN =
            "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin";

    private static final String MYSQLDUMP =
            MYSQL_BIN + "\\mysqldump.exe";

    private static final String MYSQL =
            MYSQL_BIN + "\\mysql.exe";

    private static final String DB_NAME = "event_planning_db";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "369!&Sadisa";

    // Automatic backup every day at 11:00 PM
    @Scheduled(cron = "0 0 23 * * *")
    public void performScheduledBackup() {
        try {
            createDatabaseBackup();
            System.out.println("Scheduled database backup completed successfully.");
        } catch (Exception e) {
            System.err.println("Scheduled backup failed: " + e.getMessage());
        }
    }

    // Manual database backup
    public String createManualBackup() {
        try {
            return createDatabaseBackup();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Backup failed: " + e.getMessage(), e
            );
        }
    }

    private String createDatabaseBackup() throws IOException, InterruptedException {

        Files.createDirectories(backupDirectory);

        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));

        Path backupFile = backupDirectory.resolve(
                "event_planning_backup_" + timestamp + ".sql"
        );

        ProcessBuilder processBuilder = new ProcessBuilder(
                MYSQLDUMP,
                "--host=localhost",
                "--port=3306",
                "--user=" + DB_USER,
                "--databases",
                DB_NAME,
                "--result-file=" + backupFile.toAbsolutePath()
        );

        // Pass password through environment variable instead of command arguments
        processBuilder.environment().put("MYSQL_PWD", DB_PASSWORD);

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        String output = new String(
                process.getInputStream().readAllBytes()
        );

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            Files.deleteIfExists(backupFile);

            throw new RuntimeException(
                    "mysqldump failed. " + output
            );
        }

        if (!Files.exists(backupFile) || Files.size(backupFile) == 0) {
            throw new RuntimeException(
                    "Backup file was not created correctly."
            );
        }

        System.out.println(
                "Database backup created: "
                        + backupFile.toAbsolutePath()
        );

        return backupFile.toAbsolutePath().toString();
    }

    // Restore database from an SQL backup file
    public String restoreBackup(String fileName) {

        try {
            Files.createDirectories(backupDirectory);

            Path backupFile = backupDirectory
                    .resolve(fileName)
                    .normalize();

            // Security: prevent accessing files outside backups folder
            if (!backupFile.startsWith(
                    backupDirectory.toAbsolutePath().normalize())) {

                throw new RuntimeException(
                        "Invalid backup file path."
                );
            }

            if (!Files.exists(backupFile)) {
                throw new RuntimeException(
                        "Backup file not found: " + fileName
                );
            }

            ProcessBuilder processBuilder = new ProcessBuilder(
                    MYSQL,
                    "--host=localhost",
                    "--port=3306",
                    "--user=" + DB_USER,
                    DB_NAME
            );

            processBuilder.environment().put("MYSQL_PWD", DB_PASSWORD);

            processBuilder.redirectErrorStream(true);
            processBuilder.redirectInput(backupFile.toFile());

            Process process = processBuilder.start();

            String output = new String(
                    process.getInputStream().readAllBytes()
            );

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException(
                        "Database restore failed. " + output
                );
            }

            return "Database restored successfully from: " + fileName;

        } catch (IOException | InterruptedException e) {

            throw new RuntimeException(
                    "Restore failed: " + e.getMessage(), e
            );
        }
    }
}