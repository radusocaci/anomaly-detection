package ro.tuc.ds2020.entities.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ParameterValidationException;

public enum UserType {
    DOCTOR("Doctor"),
    PATIENT("Patient"),
    CAREGIVER("Caregiver");

    private final String type;

    UserType(final String type) {
        this.type = type;
    }

    @JsonCreator
    public static UserType forType(final @JsonProperty("type") String type) {
        for (UserType userType : UserType.values()) {
            if (type.equals(userType.type)) {
                return userType;
            }
        }

        throw new ParameterValidationException(String.format("User type '%s' not supported.", type), "UserType");
    }

    public String getType() {
        return type;
    }
}
