package ro.tuc.ds2020.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.Gender;
import ro.tuc.ds2020.entities.util.UserType;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.UUID;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@EqualsAndHashCode
public class Users {

    @Id
    @GeneratedValue
    private UUID id;

    @NotEmpty
    @Size(min = 4, max = 15)
    private String username;

    @NotEmpty
    @Size(min = 4, max = 15)
    private String password;

    @JsonProperty("userType")
    private UserType type;

    @NotEmpty
    @Size(min = 4, max = 30)
    private String name;

    @NotNull
    @Past
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date birthDate;

    private Gender gender;

    private String address;
}
