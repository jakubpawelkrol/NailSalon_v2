package com.krol.nail.salon.exceptions;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.io.IOException;
import java.util.Date;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = {IllegalArgumentException.class, UsernameNotFoundException.class, ServiceNotFoundException.class})
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public ErrorMessage illegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        log.error("Illegal argument Error! 404: ", ex);
        return new ErrorMessage(
                HttpStatus.NOT_FOUND.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(true));
    }

    @ExceptionHandler(value = AppointmentNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public ErrorMessage noAppointmentException(AppointmentNotFoundException ex, HttpServletRequest request) {
        log.warn("No appointments for given criteria were found: " + request.getRequestURI());
        return new ErrorMessage(
                HttpStatus.NO_CONTENT.value(),
                new Date(),
                ex.getMessage(),
                request.getRequestURL().toString()
        );
    }

    @ExceptionHandler(value = {Exception.class, RuntimeException.class, IOException.class})
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage genericException(Exception ex, WebRequest request) {
        log.error("General Error! ISE: ", ex);
        return new ErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(true));
    }

    @ExceptionHandler(value = JsonProcessingException.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage jsonException(Exception ex, WebRequest request) {
        log.error("JSON processing Error! ISE: ", ex);
        return new ErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                new Date(),
                "Failed during JSON conversion: " + ex.getMessage(),
                request.getDescription(true));
    }

}
