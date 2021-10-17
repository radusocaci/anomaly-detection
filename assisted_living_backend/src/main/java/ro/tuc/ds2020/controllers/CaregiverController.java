package ro.tuc.ds2020.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.entities.Caregiver;
import ro.tuc.ds2020.services.CaregiverService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/caregiver")
public class CaregiverController {

    private final CaregiverService caregiverService;

    public CaregiverController(CaregiverService caregiverService) {
        this.caregiverService = caregiverService;
    }

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public List<Caregiver> getAllCaregivers() {
        return caregiverService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public Caregiver createOrUpdateCaregiver(final @Valid @RequestBody Caregiver caregiver) {
        return caregiverService.save(caregiver);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public void deleteCaregiver(final @PathVariable UUID id) {
        caregiverService.delete(id);
    }
}
