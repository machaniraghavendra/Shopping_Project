package com.shopping.query.command.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddressNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	private HttpStatus statusCode;

	private String thrownByMethod;

	private String[] thrownByMethodArgs;

	public AddressNotFoundException(HttpStatus statusCode, String thrownByMethod, String[] thrownByMethodArgs) {
		super();
		this.statusCode = statusCode;
		this.thrownByMethod = thrownByMethod;
		this.thrownByMethodArgs = thrownByMethodArgs;
	}

	public AddressNotFoundException(String message) {
		super(message);
		this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	}
}
