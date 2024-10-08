package com.shopping.query.command.service.implementation;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.dto.EmailDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

     @Autowired
     private JavaMailSender javaMailSender;

     @Autowired
     private GlobalExceptionHandler exceptionHandler;

     @Value("spring.mail.username")
     private String mail;


     @Override
     public String sendSimplemail(EmailDto email) {
          try {
               CompletableFuture.runAsync(() -> {
                    SimpleMailMessage mailMessage = new SimpleMailMessage();
                    mailMessage.setFrom(mail);
                    mailMessage.setTo(email.getRecipient());
                    mailMessage.setText(email.getMsgBody());
                    mailMessage.setSubject(email.getSubject());
                    javaMailSender.send(mailMessage);
               });

               return "Mail Sent Successfully...";
          } catch (Exception e) {
               return "Error while Sending Mail or Mail Not Found";
          }
     }

     @Override
     public String sendMailWithImageUrlandName(EmailDto email, String fileName) {
          MimeMessage mimeMessage = javaMailSender.createMimeMessage();
          try {
               CompletableFuture.runAsync(() -> {
                    try {
                         MimeMessageHelper mimeMessageHelper;
                         mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
                         mimeMessageHelper.setFrom(mail);
                         mimeMessageHelper.setTo(email.getRecipient());
                         mimeMessageHelper.setText(email.getMsgBody());
                         mimeMessageHelper.setSubject(email.getSubject());
                         var imageData = getImageDataFromUrl(email.getAttachment());
                         if (imageData != null) {
                              mimeMessageHelper.addAttachment(fileName, imageData);
                              javaMailSender.send(mimeMessage);
                         } else {
                              throw new MessagingException("Error while getting image");
                         }
                    } catch (MessagingException e) {
                         throw new RuntimeException(e);
                    }
               });
               return "Mail sent Successfully";

          } catch (Exception e) {
               return e.getMessage();
          }
     }

     private InputStreamSource getImageDataFromUrl(String attachment) {
          try {
               byte[] byteImageData = new RestTemplate().getForObject(attachment, byte[].class);
               if (byteImageData != null) {
                    // Wrap the InputStream in an InputStreamResource
                    return new InputStreamResource(new ByteArrayInputStream(byteImageData));
               }
          } catch (Exception e) {
               log.error(e.getMessage());
          }
          return null;
     }

     @Override
     public String sendMailWithImageUrl(EmailDto email, String url, String itemName) throws IOException {
          String msge = "";
          MimeMessage mimeMessage = javaMailSender.createMimeMessage();
          try {
               CompletableFuture.runAsync(() -> {
                    try {
                         MimeMessageHelper mimeMessageHelper;

                         mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
                         mimeMessageHelper.setFrom(mail);
                         mimeMessageHelper.setTo(email.getRecipient());
                         mimeMessageHelper.setText(email.getMsgBody());
                         mimeMessageHelper.setSubject(email.getSubject());

                         FileSystemResource file = new FileSystemResource(Objects.requireNonNull(downloadPdf(url, itemName)));
                         mimeMessageHelper.addAttachment(Objects.requireNonNull(file.getFilename()), file);
                         javaMailSender.send(mimeMessage);
                    } catch (MessagingException | IOException e) {
                         throw new RuntimeException(e);
                    }
               });
               return "Mail sent Successfully";
          } catch (RuntimeException e) {
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
