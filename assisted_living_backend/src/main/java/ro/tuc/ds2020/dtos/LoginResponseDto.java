package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.Gender;
import ro.tuc.ds2020.entities.util.UserType;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
@Builder
public final class LoginResponseDto {

    private String token;

    private String username;

    private String password;

    @JsonProperty("userType")
    private UserType type;

    private String name;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date birthDate;

    private Gender gender;

    private String address;
}
