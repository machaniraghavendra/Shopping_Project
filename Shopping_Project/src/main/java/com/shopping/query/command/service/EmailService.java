package com.shopping.query.command.service;

import java.io.IOException;

import com.shopping.query.command.entites.dto.EmailDto;

public interface EmailService {

     String sendSimplemail(EmailDto email);

     String sendMailWithImageUrl(EmailDto email, String url, String itemName) throws IOException;

     String sendMailWithImageUrlandName(EmailDto email, String fileName);

}