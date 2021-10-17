package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.UserType;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
@Builder
public final class UserLoginDto {

    @NotEmpty
    @Size(min = 4, max = 15)
    private String username;

    @NotEmpty
    @Size(min = 4, max = 15)
    private String password;

    @JsonProperty("userType")
    private UserType userType;
}
