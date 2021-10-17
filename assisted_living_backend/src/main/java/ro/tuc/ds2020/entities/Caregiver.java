package ro.tuc.ds2020.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public final class Caregiver extends Users {

    @OneToMany(mappedBy = "caregiver", fetch = FetchType.LAZY)
    @JsonIgnore
    private final List<Patient> patients = new ArrayList<>();
}
