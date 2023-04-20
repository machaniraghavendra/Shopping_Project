package com.shopping.query.command.exceptions;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderNotFoundException extends Exception {
	private static final long serialVersionUID = 1L;
	private HttpStatus statusCode;

	private String thrownByMethod;

	private String[] thrownByMethodArgs;

	public OrderNotFoundException(String message) {
		super(message);
		this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	}

	public OrderNotFoundException(String message, HttpStatus statuscode) {
		super(message);
		this.statusCode = statuscode;
	}
}
