package com.shopping.query.command.service;

import java.io.IOException;

import com.lowagie.text.DocumentException;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.exceptions.UserException;

import jakarta.servlet.http.HttpServletResponse;

public interface PdfGeneratorService {

     void generatePdfForOrder(HttpServletResponse response, OrdersDto ordersDto, OrdersEntity ordersEntity, String totalAmount) throws DocumentException, IOException, UserException;
}
