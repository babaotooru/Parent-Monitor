package com.parentcare.controller;

import com.parentcare.model.ActivityLog;
import com.parentcare.model.EmergencyLog;
import com.parentcare.model.Medicine;
import com.parentcare.model.User;
import com.parentcare.repository.ActivityLogRepository;
import com.parentcare.repository.EmergencyLogRepository;
import com.parentcare.repository.MedicineRepository;
import com.parentcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class WebController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MedicineRepository medicineRepository;
    @Autowired
    private ActivityLogRepository activityLogRepository;
    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/users")
    public String users(Model model) {
        List<User> list = userRepository.findAll();
        model.addAttribute("users", list);
        return "users";
    }

    @GetMapping("/parent/{id}")
    public String parentView(@PathVariable Long id, Model model) {
        User parent = userRepository.findById(id).orElse(null);
        if (parent == null)
            return "redirect:/";
        List<Medicine> meds = medicineRepository.findByUserId(id);
        List<ActivityLog> acts = activityLogRepository.findByUserId(id);
        List<EmergencyLog> ems = emergencyLogRepository.findByUserId(id);
        model.addAttribute("parent", parent);
        model.addAttribute("medicines", meds);
        model.addAttribute("activities", acts);
        model.addAttribute("emergencies", ems);
        return "parent";
    }

    @GetMapping("/guardian/{id}")
    public String guardianView(@PathVariable Long id, Model model) {
        User guardian = userRepository.findById(id).orElse(null);
        if (guardian == null)
            return "redirect:/";
        List<User> children = userRepository.findAll().stream()
                .filter(u -> guardian.getId().equals(u.getGuardianId()))
                .toList();
        model.addAttribute("guardian", guardian);
        model.addAttribute("children", children);
        return "guardian";
    }
}