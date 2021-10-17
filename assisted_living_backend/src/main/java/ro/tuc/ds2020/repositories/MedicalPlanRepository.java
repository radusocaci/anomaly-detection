package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entities.MedicalPlan;
import ro.tuc.ds2020.entities.Patient;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalPlanRepository extends JpaRepository<MedicalPlan, UUID> {

    List<MedicalPlan> findByPatient(final Patient patient);
}
