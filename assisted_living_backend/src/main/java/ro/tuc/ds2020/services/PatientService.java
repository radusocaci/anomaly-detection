package ro.tuc.ds2020.services;

import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.PatientDto;
import ro.tuc.ds2020.entities.*;
import ro.tuc.ds2020.repositories.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static java.util.Objects.nonNull;
import static ro.tuc.ds2020.dtos.mappers.PatientToPatientDtoMapper.patientDtoToPatient;

@Service
public final class PatientService {

    private final PatientRepository patientRepository;
    private final CaregiverRepository caregiverRepository;
    private final MedicalPlanRepository medicalPlanRepository;
    private final SensorDataRepository sensorDataRepository;
    private final AnomalyDataRepository anomalyDataRepository;

    public PatientService(
            PatientRepository patientRepository,
            CaregiverRepository caregiverRepository,
            MedicalPlanRepository medicalPlanRepository,
            SensorDataRepository sensorDataRepository,
            AnomalyDataRepository anomalyDataRepository) {
        this.patientRepository = patientRepository;
        this.caregiverRepository = caregiverRepository;
        this.medicalPlanRepository = medicalPlanRepository;
        this.sensorDataRepository = sensorDataRepository;
        this.anomalyDataRepository = anomalyDataRepository;
    }

    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    public Patient save(PatientDto patientDto) {
        Patient patient = patientDtoToPatient(patientDto);
        Optional<Caregiver> caregiverOptional;

        if (nonNull(patientDto.getCaregiverId())) {
            caregiverOptional = caregiverRepository.findById(patientDto.getCaregiverId());
            caregiverOptional.ifPresent(patient::setCaregiver);
            if (patient.getCaregiver() == null) {
                throw new ResourceNotFoundException("Caregiver");
            }
        }

        return patientRepository.save(patient);
    }

    public void delete(UUID id) {
        Optional<Patient> patientOptional = patientRepository.findById(id);

        if (!patientOptional.isPresent()) {
            throw new ResourceNotFoundException("Patient");
        }

        Patient patient = patientOptional.get();
        Set<MedicalPlan> medicalPlans = patient.getMedicalPlan();
        Set<SensorData> sensorData = patient.getSensorData();
        Set<AnomalyData> anomalyData = patient.getAnomalyData();

        medicalPlanRepository.deleteInBatch(medicalPlans);
        sensorDataRepository.deleteInBatch(sensorData);
        anomalyDataRepository.deleteInBatch(anomalyData);

        patientRepository.deleteById(id);
    }
}
