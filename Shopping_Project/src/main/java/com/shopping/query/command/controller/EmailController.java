package com.shopping.query.command.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.dto.EmailDto;
import com.shopping.query.command.service.EmailService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/mail/")
public class EmailController {

	@Autowired
	private EmailService emailimpl;

	@PostMapping("/sendmail")
	public String sendMail(@RequestBody EmailDto mail) {
		return emailimpl.sendSimplemail(mail);
	}

	@PostMapping("/sendMailWithAttachment")
	public String sendMailWithAttachment(@RequestBody EmailDto mail, @RequestParam String url,
			@RequestParam String itemName) throws IOException {
		itemName = itemName.replace(" ", "_");
		return emailimpl.sendMailWithAttachment(mail, url, itemName);
	}
}
