package com.shopping.query.command.exceptions;

public class UserAlreadyExistsException extends Exception {
	public UserAlreadyExistsException(String message) {
		super(message);
	}
}
