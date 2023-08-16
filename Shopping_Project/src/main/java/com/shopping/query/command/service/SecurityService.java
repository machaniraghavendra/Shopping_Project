package com.shopping.query.command.service;

public interface SecurityService {
	String encrypt(String toConvert);

	String decrypt(String toConvert);
}
