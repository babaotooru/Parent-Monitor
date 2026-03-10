package com.parentcare.repository;

import com.parentcare.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByUserId(Long userId);

    List<Medicine> findByUserIdAndStatus(Long userId, Medicine.MedicineStatus status);

    List<Medicine> findByStatus(Medicine.MedicineStatus status);

    Long countByUserIdAndStatus(Long userId, Medicine.MedicineStatus status);
}