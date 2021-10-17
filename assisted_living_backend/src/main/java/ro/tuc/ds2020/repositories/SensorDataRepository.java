package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entities.Patient;
import ro.tuc.ds2020.entities.SensorData;

import java.util.List;
import java.util.UUID;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, UUID> {

    void deleteAllByPatient(final Patient patient);

    List<SensorData> getAllByPatient(final Patient patient);
}
