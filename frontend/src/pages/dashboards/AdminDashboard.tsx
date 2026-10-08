import React, { useState } from "react";

interface AdminDashboardProps {
    onNavigate?: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
                                                           onNavigate,
                                                       }) => {
    const [backupMessage, setBackupMessage] = useState("");
    const [backupLoading, setBackupLoading] = useState(false);
    const [restoreFileName, setRestoreFileName] = useState("");
    const [restoreLoading, setRestoreLoading] = useState(false);
    const [restoreMessage, setRestoreMessage] = useState("");

    const createBackup = async () => {
        setBackupLoading(true);
        setBackupMessage("");

        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(
                "http://localhost:8080/backup/create",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data || "Backup failed");
            }

            setBackupMessage(data);
        } catch (error) {
            setBackupMessage(
                error instanceof Error
                    ? error.message
                    : "Backup failed"
            );
        } finally {
            setBackupLoading(false);
        }
    };
    const restoreBackup = async () => {
        if (!restoreFileName.trim()) {
            setRestoreMessage("Please enter a backup file name.");
            return;
        }

        setRestoreLoading(true);
        setRestoreMessage("");

        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(
                `http://localhost:8080/backup/restore?fileName=${encodeURIComponent(
                    restoreFileName.trim()
                )}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data || "Restore failed");
            }

            setRestoreMessage(data);
        } catch (error) {
            setRestoreMessage(
                error instanceof Error
                    ? error.message
                    : "Restore failed"
            );
        } finally {
            setRestoreLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px",
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "#ffffff",
                    padding: "25px 30px",
                    borderRadius: "12px",
                    marginBottom: "25px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "28px",
                        color: "#1f2937",
                    }}
                >
                    Admin Dashboard
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#6b7280",
                    }}
                >
                    Manage users, monitor system activity and perform
                    system backups.
                </p>
            </div>

            {/* Dashboard Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "25px",
                }}
            >
                {/* User Management */}
                <div
                    style={{
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2>👥 User Management</h2>

                    <p style={{ color: "#6b7280" }}>
                        Create, update, delete and manage system users.
                    </p>

                    <button
                        onClick={() => onNavigate?.("users")}
                        style={buttonStyle}
                    >
                        Manage Users
                    </button>
                </div>

                {/* Activity Logs */}
                <div
                    style={{
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2>📋 Activity Logs</h2>

                    <p style={{ color: "#6b7280" }}>
                        Monitor user activities and system security events.
                    </p>

                    <button
                        onClick={() => onNavigate?.("activityLogs")}
                        style={buttonStyle}
                    >
                        View Activity Logs
                    </button>
                </div>

                {/* Backup */}
                <div
                    style={{
                        background: "#ffffff",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2>💾 System Backup</h2>

                    <p style={{ color: "#6b7280" }}>
                        Create a database backup to protect important
                        system data.
                    </p>

                    <button
                        onClick={createBackup}
                        disabled={backupLoading}
                        style={{
                            ...buttonStyle,
                            background: backupLoading
                                ? "#9ca3af"
                                : "#2563eb",
                            cursor: backupLoading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {backupLoading
                            ? "Creating Backup..."
                            : "Create Backup"}
                    </button>

                    {backupMessage && (
                        <div
                            style={{
                                marginTop: "15px",
                                padding: "12px",
                                background: backupMessage
                                    .toLowerCase()
                                    .includes("successfully")
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color: backupMessage
                                    .toLowerCase()
                                    .includes("successfully")
                                    ? "#166534"
                                    : "#991b1b",
                                borderRadius: "8px",
                                fontSize: "13px",
                                wordBreak: "break-word",
                            }}
                        >
                            {backupMessage}
                        </div>
                    )}

                </div>
            </div>
            <div
                style={{
                    marginTop: "25px",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "20px",
                }}
            >
                <h3
                    style={{
                        marginBottom: "8px",
                        color: "#1f2937",
                    }}
                >
                    Restore Database
                </h3>

                <p
                    style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        marginBottom: "12px",
                    }}
                >
                    Enter the backup file name to restore the database.
                </p>

                <input
                    type="text"
                    value={restoreFileName}
                    onChange={(e) => setRestoreFileName(e.target.value)}
                    placeholder="event_planning_backup_2026-10-07_22-06-10.sql"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "7px",
                        marginBottom: "10px",
                        fontSize: "14px",
                    }}
                />

                <button
                    onClick={restoreBackup}
                    disabled={restoreLoading}
                    style={{
                        border: "none",
                        padding: "11px 18px",
                        borderRadius: "7px",
                        background: restoreLoading
                            ? "#9ca3af"
                            : "#dc2626",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: restoreLoading
                            ? "not-allowed"
                            : "pointer",
                    }}
                >
                    {restoreLoading
                        ? "Restoring..."
                        : "Restore Backup"}
                </button>

                {restoreMessage && (
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "12px",
                            background: restoreMessage
                                .toLowerCase()
                                .includes("successfully")
                                ? "#dcfce7"
                                : "#fee2e2",
                            color: restoreMessage
                                .toLowerCase()
                                .includes("successfully")
                                ? "#166534"
                                : "#991b1b",
                            borderRadius: "8px",
                            fontSize: "13px",
                            wordBreak: "break-word",
                        }}
                    >
                        {restoreMessage}
                    </div>
                )}
            </div>
            {/* Admin Responsibilities */}
            <div
                style={{
                    background: "#ffffff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <h2>System Administrator</h2>

                <ul
                    style={{
                        color: "#4b5563",
                        lineHeight: "2",
                    }}
                >
                    <li>Manage user accounts</li>
                    <li>Manage roles and permissions</li>
                    <li>Monitor system activities</li>
                    <li>Review security logs</li>
                    <li>Create database backups</li>
                    <li>Protect important event and customer data</li>
                </ul>
            </div>
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
};

export default AdminDashboard;