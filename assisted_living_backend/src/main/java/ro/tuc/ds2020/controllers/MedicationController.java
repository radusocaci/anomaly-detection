package ro.tuc.ds2020.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.entities.Medication;
import ro.tuc.ds2020.services.MedicationService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("medication")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public List<Medication> getAllMedications() {
        return medicationService.findAll();
    }

    @GetMapping("{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public Medication getMedication(final @PathVariable UUID id) {
        return medicationService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public Medication createOrUpdateMedication(final @Valid @RequestBody Medication medication) {
        return medicationService.save(medication);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public void deleteMedication(final @PathVariable UUID id) {
        medicationService.delete(id);
    }
}
