package ro.tuc.ds2020.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public final class Medication implements Serializable {

    @ManyToMany(mappedBy = "medications")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private final Set<MedicalPlan> medicalPlans = new HashSet<>();

    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank
    @Size(min = 3, max = 20)
    private String name;

    @Pattern(regexp = "[a-zA-Z ]+(,[a-zA-Z ]+)*")
    private String sideEffects;

    @NotBlank
    private String dosage;
}
