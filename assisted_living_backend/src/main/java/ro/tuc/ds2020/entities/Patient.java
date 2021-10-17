package ro.tuc.ds2020.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public final class Patient extends Users {

    @NotBlank
    private String medicalRecord;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "caregiver_id")
    private Caregiver caregiver;

    @OneToMany(mappedBy = "patient", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<MedicalPlan> medicalPlan = new HashSet<>();

    @OneToMany(mappedBy = "patient", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<SensorData> sensorData = new HashSet<>();

    @OneToMany(mappedBy = "patient", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<AnomalyData> anomalyData = new HashSet<>();

}
