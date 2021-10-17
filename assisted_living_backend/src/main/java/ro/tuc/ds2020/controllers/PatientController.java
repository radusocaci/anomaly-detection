package ro.tuc.ds2020.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PatientDto;
import ro.tuc.ds2020.entities.Patient;
import ro.tuc.ds2020.services.PatientService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('CAREGIVER')")
    public List<Patient> getAllPatients() {
        return patientService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public Patient createOrUpdatePatient(final @Valid @RequestBody PatientDto patientDto) {
        return patientService.save(patientDto);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public void deletePatient(final @PathVariable UUID id) {
        patientService.delete(id);
    }
}
