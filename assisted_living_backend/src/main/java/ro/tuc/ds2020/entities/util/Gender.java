package ro.tuc.ds2020.entities.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ParameterValidationException;

public enum Gender {
    MALE("Male"),
    FEMALE("Female");

    private final String gender;

    Gender(String gender) {
        this.gender = gender;
    }

    @JsonCreator
    public static Gender forGender(final @JsonProperty("gender") String gender) {
        for (Gender genderEnum : Gender.values()) {
            if (gender.equals(genderEnum.gender)) {
                return genderEnum;
            }
        }

        throw new ParameterValidationException(String.format("Gender '%s' not supported.", gender), "Gender");
    }

    public String getGender() {
        return gender;
    }
}
