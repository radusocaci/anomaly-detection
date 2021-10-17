package ro.tuc.ds2020.controllers.handlers.exceptions.model;

import org.springframework.http.HttpStatus;

import java.util.Collections;

public class ParameterValidationException extends CustomException {
    private static final HttpStatus httpStatus = HttpStatus.BAD_REQUEST;

    public ParameterValidationException(String message, String resource) {
        super(message, httpStatus, resource, Collections.emptyList());
    }
}