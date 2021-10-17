package ro.tuc.ds2020.controllers.handlers.exceptions.model;

import org.springframework.http.HttpStatus;

import java.util.Collections;

public class UserNotFoundException extends CustomException {

    private static final String MESSAGE = "Invalid credentials. Check the password and try again.";
    private static final String RESOURCE = "UserLogin";
    private static final HttpStatus httpStatus = HttpStatus.NOT_FOUND;

    public UserNotFoundException() {
        super(MESSAGE, httpStatus, RESOURCE, Collections.emptyList());
    }
}
