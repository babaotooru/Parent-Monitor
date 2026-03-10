package com.parentcare.controller;

import com.parentcare.model.Medicine;
import com.parentcare.repository.MedicineRepository;
import com.parentcare.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<Medicine> findByUser(@PathVariable Long userId) {
        return medicineRepository.findByUserId(userId);
    }

    @PostMapping
    public Medicine save(@RequestBody Medicine m) {
        m.setCreatedAt(LocalDateTime.now());
        m.setConsecutiveMissed(0);
        m.setTotalTaken(0);
        m.setTotalMissed(0);
        m.setComplianceRate(100.0);
        return medicineRepository.save(m);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> update(@PathVariable Long id, @RequestBody Medicine m) {
        return medicineRepository.findById(id)
                .map(existing -> {
                    existing.setName(m.getName());
                    existing.setDosage(m.getDosage());
                    existing.setSchedule(m.getSchedule());
                    existing.setFrequency(m.getFrequency());
                    existing.setStatus(m.getStatus());
                    existing.setVoiceReminderEnabled(m.getVoiceReminderEnabled());
                    existing.setNotifyGuardianOnMiss(m.getNotifyGuardianOnMiss());
                    existing.setInstructions(m.getInstructions());
                    existing.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(medicineRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/taken")
    public ResponseEntity<Medicine> markAsTaken(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(medicine -> {
                    medicine.setStatus(Medicine.MedicineStatus.TAKEN);
                    medicine.setLastTaken(LocalDateTime.now());
                    medicine.setConsecutiveMissed(0);
                    medicine.setTotalTaken(medicine.getTotalTaken() + 1);

                    // Update compliance rate
                    int total = medicine.getTotalTaken() + medicine.getTotalMissed();
                    medicine.setComplianceRate((double) medicine.getTotalTaken() / total * 100.0);

                    return ResponseEntity.ok(medicineRepository.save(medicine));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/missed")
    public ResponseEntity<Medicine> markAsMissed(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(medicine -> {
                    medicine.setStatus(Medicine.MedicineStatus.MISSED);
                    medicine.setConsecutiveMissed(medicine.getConsecutiveMissed() + 1);
                    medicine.setTotalMissed(medicine.getTotalMissed() + 1);

                    // Update compliance rate
                    int total = medicine.getTotalTaken() + medicine.getTotalMissed();
                    medicine.setComplianceRate((double) medicine.getTotalTaken() / total * 100.0);

                    Medicine saved = medicineRepository.save(medicine);

                    // Send notification to guardian if threshold reached
                    if (medicine.getNotifyGuardianOnMiss() &&
                            medicine.getConsecutiveMissed() >= medicine.getMissedThreshold()) {
                        notificationService.sendMedicineMissedAlert(medicine.getUserId(), saved);
                    }

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
