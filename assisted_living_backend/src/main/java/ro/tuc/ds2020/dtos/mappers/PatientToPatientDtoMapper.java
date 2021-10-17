package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.PatientDto;
import ro.tuc.ds2020.entities.Patient;
import ro.tuc.ds2020.entities.util.UserType;

public final class PatientToPatientDtoMapper {

    public static Patient patientDtoToPatient(PatientDto patientDto) {
        Patient patient = new Patient();
        patient.setId(patientDto.getId());
        patient.setName(patientDto.getName());
        patient.setUsername(patientDto.getUsername());
        patient.setPassword(patientDto.getPassword());
        patient.setBirthDate(patientDto.getBirthDate());
        patient.setAddress(patientDto.getAddress());
        patient.setGender(patientDto.getGender());
        patient.setType(UserType.PATIENT);
        patient.setMedicalRecord(patientDto.getMedicalRecord());
        return patient;
    }
}
