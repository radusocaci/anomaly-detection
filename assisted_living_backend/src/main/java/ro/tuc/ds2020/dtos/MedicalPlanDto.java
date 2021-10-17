package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public final class MedicalPlanDto {

    @JsonProperty("medication-ids")
    @NotEmpty
    private final List<UUID> medicationIds = new ArrayList<>();

    private UUID id;

    @JsonProperty("patient-id")
    @NotNull
    private UUID patientId;

    @FutureOrPresent
    @NotNull
    @JsonFormat(pattern = "dd-MM-yyyy")
    @JsonProperty("treatment-start-date")
    private Date treatmentStartDate;

    @FutureOrPresent
    @NotNull
    @JsonFormat(pattern = "dd-MM-yyyy")
    @JsonProperty("treatment-end-date")
    private Date treatmentEndDate;

    private String intakeInterval;
}
