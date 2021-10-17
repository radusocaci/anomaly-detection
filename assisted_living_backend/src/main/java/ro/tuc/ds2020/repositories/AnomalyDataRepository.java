package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entities.AnomalyData;
import ro.tuc.ds2020.entities.Patient;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnomalyDataRepository extends JpaRepository<AnomalyData, UUID> {

    void deleteAllByPatient(final Patient patient);

    List<AnomalyData> getAllByPatient(final Patient patient);
}
