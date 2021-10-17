package ro.tuc.ds2020.services;

import org.springframework.stereotype.Service;
import ro.tuc.ds2020.entities.Doctor;
import ro.tuc.ds2020.entities.util.UserType;
import ro.tuc.ds2020.repositories.DoctorRepository;

import java.util.List;

@Service
public final class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    public Doctor save(Doctor doctor) {
        doctor.setType(UserType.DOCTOR);
        return doctorRepository.save(doctor);
    }
}
