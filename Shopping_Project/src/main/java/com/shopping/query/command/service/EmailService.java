package com.shopping.query.command.service;

import java.io.IOException;

import com.shopping.query.command.entites.dto.EmailDto;

public interface EmailService {

	String sendSimplemail(EmailDto email);

	String sendMailWithAttachment(EmailDto email, String url, String itemName) throws  IOException;
}
