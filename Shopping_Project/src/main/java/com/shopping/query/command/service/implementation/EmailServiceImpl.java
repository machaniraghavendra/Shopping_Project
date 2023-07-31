package com.shopping.query.command.service.implementation;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.dto.EmailDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private GlobalExceptionHandler exceptionHandler;

	@Override
	public String sendSimplemail(EmailDto email) {
		try {
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setFrom("raghu1000.rm@gmail.com");
			mailMessage.setTo(email.getRecipient());
			mailMessage.setText(email.getMsgBody());
			mailMessage.setSubject(email.getSubject());
			javaMailSender.send(mailMessage);
			return "Mail Sent Successfully...";
		} catch (Exception e) {
			return "Error while Sending Mail or Mail Not Found";
		}
	}

	@Override
	public String sendMailWithAttachment(EmailDto email, String url, String itemName) throws IOException {
		String msge = "";
		MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		MimeMessageHelper mimeMessageHelper;
		try {
			mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
			mimeMessageHelper.setFrom("raghu1000.rm@gmail.com");
			mimeMessageHelper.setTo(email.getRecipient());
			mimeMessageHelper.setText(email.getMsgBody());
			mimeMessageHelper.setSubject(email.getSubject());

			FileSystemResource file = new FileSystemResource(downloadPdf(url, itemName));
			mimeMessageHelper.addAttachment(file.getFilename(), file);
			javaMailSender.send(mimeMessage);
			return "Mail sent Successfully";
		} catch (IOException e) {
			msge = exceptionHandler.globalException(e).getBody();
		} catch (MessagingException e) {
			msge = e.getMessage();
		}
		return msge;
	}

	private static File downloadPdf(String pdfUrl, String itemName) throws IOException {
		URL url = new URL(pdfUrl);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		int responseCode = connection.getResponseCode();
		if (responseCode == HttpURLConnection.HTTP_OK) {
			String dateTime = LocalDateTime.now().toString().replace("T", "_").replace("-", "_").replace(":", "_");
			File tempFile = File.createTempFile(itemName + "_" + dateTime, ".pdf");
			try (InputStream inputStream = new BufferedInputStream(connection.getInputStream());
					FileOutputStream outputStream = new FileOutputStream(tempFile)) {
				byte[] buffer = new byte[4096];
				int bytesRead;
				while ((bytesRead = inputStream.read(buffer)) != -1) {
					outputStream.write(buffer, 0, bytesRead);
				}
			}
			connection.disconnect();
			return tempFile;
		} else {
			connection.disconnect();
			return null;
		}
	}
}
