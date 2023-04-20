package com.shopping.query.command.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	private HttpStatus statusCode;

	private String thrownByMethod;

	private String[] thrownByMethodArgs;

	public ItemNotFoundException(String message) {
		super(message);
		this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	}

	public ItemNotFoundException(String message, HttpStatus statuscode) {
		super(message);
		this.statusCode = statuscode;
	}
}
