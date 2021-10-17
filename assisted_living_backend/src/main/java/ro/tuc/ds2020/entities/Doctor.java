package ro.tuc.ds2020.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public final class Doctor extends Users {

}
