package ro.tuc.ds2020.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.entities.Doctor;
import ro.tuc.ds2020.services.DoctorService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public List<Doctor> getAllDoctors() {
        return doctorService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public Doctor createOrUpdateDoctor(final @Valid @RequestBody Doctor doctor) {
        return doctorService.save(doctor);
    }
}
