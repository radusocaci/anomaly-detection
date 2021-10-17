package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entities.Caregiver;
import ro.tuc.ds2020.entities.Patient;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    List<Patient> findAllByCaregiver(Caregiver caregiver);

    Optional<Patient> findByUsername(String username);
}
