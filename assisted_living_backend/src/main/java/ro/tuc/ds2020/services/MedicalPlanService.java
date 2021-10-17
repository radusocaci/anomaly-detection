package ro.tuc.ds2020.services;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.MedicalPlanDto;
import ro.tuc.ds2020.entities.MedicalPlan;
import ro.tuc.ds2020.entities.Medication;
import ro.tuc.ds2020.entities.Patient;
import ro.tuc.ds2020.repositories.MedicalPlanRepository;
import ro.tuc.ds2020.repositories.MedicationRepository;
import ro.tuc.ds2020.repositories.PatientRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.Objects.nonNull;
import static ro.tuc.ds2020.dtos.mappers.MedicalPlanToMedicalPlanDtoMapper.medicalPlanDtoToMedicalPlan;

@Service
public final class MedicalPlanService {

    private final MedicalPlanRepository medicalPlanRepository;
    private final PatientRepository patientRepository;
    private final MedicationRepository medicationRepository;

    public MedicalPlanService(
            MedicalPlanRepository medicalPlanRepository,
            PatientRepository patientRepository,
            MedicationRepository medicationRepository) {
        this.medicalPlanRepository = medicalPlanRepository;
        this.patientRepository = patientRepository;
        this.medicationRepository = medicationRepository;
    }

    public MedicalPlan save(MedicalPlanDto medicalPlanDto) {
        MedicalPlan medicalPlan = medicalPlanDtoToMedicalPlan(medicalPlanDto);
        Optional<Patient> patientOptional;
        Optional<List<Medication>> medicationListOptional = Optional.empty();

        if (nonNull(medicalPlanDto.getPatientId())) {
            patientOptional = patientRepository.findById(medicalPlanDto.getPatientId());
            patientOptional.ifPresent(medicalPlan::setPatient);
            if (medicalPlan.getPatient() == null) {
                throw new ResourceNotFoundException("Patient");
            }
        }

        if (!CollectionUtils.isEmpty(medicalPlanDto.getMedicationIds())) {
            medicationListOptional = Optional.of(medicationRepository.findAllById(medicalPlanDto.getMedicationIds()));
        }

        medicationListOptional.ifPresent(medicalPlan::addMedications);
        if (CollectionUtils.isEmpty(medicalPlan.getMedications())) {
            throw new ResourceNotFoundException("Medication");
        }

        return medicalPlanRepository.save(medicalPlan);
    }

    public List<MedicalPlan> findByPatientUsername(String patientUsername) {
        Optional<Patient> patientOptional = patientRepository.findByUsername(patientUsername);

        if (!patientOptional.isPresent()) {
            throw new ResourceNotFoundException("Patient");
        }

        List<MedicalPlan> medicalPlans = medicalPlanRepository.findByPatient(patientOptional.get());

        if (CollectionUtils.isEmpty(medicalPlans)) {
            throw new ResourceNotFoundException("MedicalPlan");
        }

        return medicalPlans;
    }

    public List<MedicalPlan> findAll() {
        return medicalPlanRepository.findAll();
    }

    public void delete(UUID id) {
        medicalPlanRepository.deleteById(id);
    }
}
