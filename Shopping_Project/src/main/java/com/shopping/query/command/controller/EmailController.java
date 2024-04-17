package com.shopping.query.command.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.dto.EmailDto;
import com.shopping.query.command.service.EmailService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/mail/")
@Tag(name = "Email Api's", description = "Sending mail to anyone from raghuxxxxxxx@gmail.com")
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
		itemName = itemName.replace(" ", "_").replace("-", "");
		return emailimpl.sendMailWithImageUrl(mail, url, itemName);
	}
}
