package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.MedicationDto;
import ro.tuc.ds2020.entities.Medication;

public final class MedicationToMedicationDtoMapper {

    public static MedicationDto medicationToMedicationDto(Medication medication) {
        MedicationDto medicationDto = new MedicationDto();
        medicationDto.setName(medication.getName());
        medicationDto.setId(medication.getId());
        medicationDto.setDosage(medication.getDosage());
        medicationDto.setSideEffects(medication.getSideEffects());
        return medicationDto;
    }
}
