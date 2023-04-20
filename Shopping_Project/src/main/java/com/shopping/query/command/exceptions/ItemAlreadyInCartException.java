package com.shopping.query.command.exceptions;

public class ItemAlreadyInCartException extends Exception {
	public ItemAlreadyInCartException(String message) {
		super(message);
	}
}
