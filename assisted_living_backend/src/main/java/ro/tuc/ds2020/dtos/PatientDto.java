package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.Gender;

import javax.validation.constraints.*;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public final class PatientDto {

    private UUID id;

    @JsonProperty("caregiver-id")
    private UUID caregiverId;

    @NotEmpty
    @Size(min = 4, max = 15)
    private String username;

    @NotEmpty
    @Size(min = 4, max = 15)
    private String password;

    @NotEmpty
    @Size(min = 4, max = 30)
    private String name;

    @NotBlank
    private String medicalRecord;

    private String address;

    @NotNull
    @Past
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date birthDate;

    private Gender gender;
}
