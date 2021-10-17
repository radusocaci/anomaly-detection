package ro.tuc.ds2020.services;

import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.entities.Medication;
import ro.tuc.ds2020.repositories.MedicationRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public final class MedicationService {

    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<Medication> findAll() {
        return medicationRepository.findAll();
    }

    public Medication findById(UUID id) {
        Optional<Medication> medicationOptional = medicationRepository.findById(id);

        if (!medicationOptional.isPresent()) {
            throw new ResourceNotFoundException("Medication");
        }

        return medicationOptional.get();
    }

    public Medication save(Medication medication) {
        return medicationRepository.save(medication);
    }

    public void delete(UUID id) {
        medicationRepository.deleteById(id);
    }
}
