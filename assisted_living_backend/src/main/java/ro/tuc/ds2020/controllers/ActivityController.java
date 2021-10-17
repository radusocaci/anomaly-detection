package ro.tuc.ds2020.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.ActivityBatchDto;
import ro.tuc.ds2020.entities.AnomalyData;
import ro.tuc.ds2020.services.ActivityService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public void saveActivitiesForPatient(final @Valid @RequestBody ActivityBatchDto activityBatchDto) {
        activityService.saveAll(activityBatchDto);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public void deleteActivitiesForPatient(final @PathVariable UUID id) {
        activityService.deleteAll(id);
    }

    @PostMapping("check-anomaly")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('CAREGIVER')")
    public void checkActivitiesForPatient(final @Valid @RequestBody ActivityBatchDto activityBatchDto) {
        activityService.checkAll(activityBatchDto);
    }

    @GetMapping("{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('CAREGIVER')")
    public List<AnomalyData> getAnomaliesForPatient(final @PathVariable UUID patientId) {
        return activityService.getAnomaliesForPatient(patientId);
    }
}
