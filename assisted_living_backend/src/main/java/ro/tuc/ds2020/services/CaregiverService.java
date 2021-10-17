package ro.tuc.ds2020.services;

import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.entities.Caregiver;
import ro.tuc.ds2020.entities.Patient;
import ro.tuc.ds2020.entities.util.UserType;
import ro.tuc.ds2020.repositories.CaregiverRepository;
import ro.tuc.ds2020.repositories.PatientRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public final class CaregiverService {

    private final CaregiverRepository caregiverRepository;
    private final PatientRepository patientRepository;

    public CaregiverService(CaregiverRepository caregiverRepository, PatientRepository patientRepository) {
        this.caregiverRepository = caregiverRepository;
        this.patientRepository = patientRepository;
    }

    public List<Caregiver> findAll() {
        return caregiverRepository.findAll();
    }

    public Caregiver save(Caregiver caregiver) {
        caregiver.setType(UserType.CAREGIVER);
        return caregiverRepository.save(caregiver);
    }

    public void delete(UUID id) {
        Optional<Caregiver> caregiverOptional = caregiverRepository.findById(id);

        if (!caregiverOptional.isPresent()) {
            throw new ResourceNotFoundException("Caregiver");
        }

        List<Patient> patients = patientRepository.findAllByCaregiver(caregiverOptional.get());

        if (!patients.isEmpty()) {
            patients.forEach(patient -> patient.setCaregiver(null));
            patientRepository.saveAll(patients);
        }

        caregiverRepository.deleteById(id);
    }
}
