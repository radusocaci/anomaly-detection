package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.MedicalPlanDto;
import ro.tuc.ds2020.entities.MedicalPlan;

public final class MedicalPlanToMedicalPlanDtoMapper {

    public static MedicalPlan medicalPlanDtoToMedicalPlan(MedicalPlanDto medicalPlanDto) {
        MedicalPlan medicalPlan = new MedicalPlan();
        medicalPlan.setId(medicalPlanDto.getId());
        medicalPlan.setTreatmentStartDate(medicalPlanDto.getTreatmentStartDate());
        medicalPlan.setTreatmentEndDate(medicalPlanDto.getTreatmentEndDate());
        medicalPlan.setIntakeInterval(medicalPlanDto.getIntakeInterval());
        return medicalPlan;
    }
}
