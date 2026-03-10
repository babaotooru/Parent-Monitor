package com.parentcare.dto;

import java.util.List;

public class MedicineLogOutput {
    private List<MedicineLogEntry> medicineLog;
    private String guardianNotification;
    private int totalTaken;
    private int totalMissed;
    private int totalPending;
    private double complianceRate;

    public static class MedicineLogEntry {
        private String time;
        private String medicineName;
        private String status;
        private String dosage;
        private String notes;

        public MedicineLogEntry(String time, String medicineName, String status, String dosage, String notes) {
            this.time = time;
            this.medicineName = medicineName;
            this.status = status;
            this.dosage = dosage;
            this.notes = notes;
        }

        // Getters
        public String getTime() {
            return time;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public String getStatus() {
            return status;
        }

        public String getDosage() {
            return dosage;
        }

        public String getNotes() {
            return notes;
        }
    }

    public static class GuardianAlert {
        private String alertType;
        private String patientName;
        private String medicineName;
        private String time;
        private String severity;

        public GuardianAlert(String alertType, String patientName, String medicineName, String time, String severity) {
            this.alertType = alertType;
            this.patientName = patientName;
            this.medicineName = medicineName;
            this.time = time;
            this.severity = severity;
        }

        // Getters
        public String getAlertType() {
            return alertType;
        }

        public String getPatientName() {
            return patientName;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public String getTime() {
            return time;
        }

        public String getSeverity() {
            return severity;
        }
    }

    // Getters and Setters
    public List<MedicineLogEntry> getMedicineLog() {
        return medicineLog;
    }

    public void setMedicineLog(List<MedicineLogEntry> medicineLog) {
        this.medicineLog = medicineLog;
    }

    public String getGuardianNotification() {
        return guardianNotification;
    }

    public void setGuardianNotification(String guardianNotification) {
        this.guardianNotification = guardianNotification;
    }

    public int getTotalTaken() {
        return totalTaken;
    }

    public void setTotalTaken(int totalTaken) {
        this.totalTaken = totalTaken;
    }

    public int getTotalMissed() {
        return totalMissed;
    }

    public void setTotalMissed(int totalMissed) {
        this.totalMissed = totalMissed;
    }

    public int getTotalPending() {
        return totalPending;
    }

    public void setTotalPending(int totalPending) {
        this.totalPending = totalPending;
    }

    public double getComplianceRate() {
        return complianceRate;
    }

    public void setComplianceRate(double complianceRate) {
        this.complianceRate = complianceRate;
    }
}
