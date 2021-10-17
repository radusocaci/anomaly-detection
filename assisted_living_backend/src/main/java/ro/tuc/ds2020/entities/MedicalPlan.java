package ro.tuc.ds2020.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.*;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
@EqualsAndHashCode
public final class MedicalPlan implements Serializable {

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "medication_medical_plan",
            joinColumns = @JoinColumn(name = "medical_plan_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "medication_id", referencedColumnName = "id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private final Set<Medication> medications = new HashSet<>();

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @FutureOrPresent
    @NotNull
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date treatmentStartDate;

    @FutureOrPresent
    @NotNull
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date treatmentEndDate;

    private String intakeInterval;

    @AssertTrue(message = "End date should be after the start date")
    private boolean endDateBeforeStartDate() {
        return treatmentEndDate.after(treatmentStartDate);
    }

    public void addMedications(List<Medication> medicationList) {
        medications.addAll(medicationList);
    }
}
