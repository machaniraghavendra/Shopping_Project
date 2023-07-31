package com.shopping.query.command.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lowagie.text.DocumentException;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.OrderService;
import com.shopping.query.command.service.PdfGeneratorService;

import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/pdf/generate")
@CrossOrigin(origins = "*")
public class PdfGeneratorController {

	@Autowired
	private OrderService orderService;
	
	@Autowired
	private PdfGeneratorService pdfGeneratorService;

	@GetMapping("/{orderId}")
	public void generatePdf(HttpServletResponse response,@PathVariable UUID orderId) throws ItemNotFoundException, DocumentException, IOException, UserNotFoundException {
		response.setContentType("application/pdf");
		OrdersEntity order = orderService.getWithUUID(orderId);
		OrdersDto  ordersDto = orderService.getOrderDtowithOrderUUID(orderId);
		String headerkey = "Content-Disposition";
		String headervalue = "attachment; filename=" + ordersDto.getItem().getItemName()+"-"+ LocalDateTime.now().toString().replace("T"," ") + ".pdf";
		response.setHeader(headerkey, headervalue);
		pdfGeneratorService.generatePdf(response, ordersDto,order,ordersDto.getTotalOrderAmount());
	}
}
