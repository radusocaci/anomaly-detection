package ro.tuc.ds2020.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.MedicalPlanDto;
import ro.tuc.ds2020.entities.MedicalPlan;
import ro.tuc.ds2020.services.MedicalPlanService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("medical-plan")
public class MedicalPlanController {

    private final MedicalPlanService medicalPlanService;

    public MedicalPlanController(MedicalPlanService medicalPlanService) {
        this.medicalPlanService = medicalPlanService;
    }

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public List<MedicalPlan> getAllMedicalPlans() {
        return medicalPlanService.findAll();
    }

    @GetMapping("{patientUsername}")
    @PreAuthorize("hasRole('PATIENT')")
    public List<MedicalPlan> getMedicalPlanByPatient(final @PathVariable String patientUsername) {
        return medicalPlanService.findByPatientUsername(patientUsername);
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public MedicalPlan createOrUpdateMedicalPlan(final @Valid @RequestBody MedicalPlanDto medicalPlanDto) {
        return medicalPlanService.save(medicalPlanDto);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public void deleteMedicationPlan(final @PathVariable UUID id) {
        medicalPlanService.delete(id);
    }
}
