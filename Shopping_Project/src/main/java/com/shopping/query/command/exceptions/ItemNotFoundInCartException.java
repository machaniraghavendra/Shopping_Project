package com.shopping.query.command.exceptions;

public class ItemNotFoundInCartException extends Exception {
	public ItemNotFoundInCartException(String message) {
		super(message);
	}
}
