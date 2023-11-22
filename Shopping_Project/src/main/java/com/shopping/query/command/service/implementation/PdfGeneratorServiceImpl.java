package com.shopping.query.command.service.implementation;

import java.io.IOException;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.service.PdfGeneratorService;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class PdfGeneratorServiceImpl implements PdfGeneratorService {

	@Autowired
	private MappersClass mapper;

	@Autowired
	private GlobalExceptionHandler exceptionHandler;

	@Override
	public void generatePdf(HttpServletResponse response, OrdersDto ordersDto, OrdersEntity ordersEntity,
			String totalAmount) throws DocumentException, IOException, UserException {
		if (Objects.nonNull(ordersEntity) && Objects.nonNull(ordersDto)) {
			try {
				Document document = new Document(PageSize.A4);
				UserDetailDto user = mapper.userDetailDtoMapper(ordersEntity.getUserId());
				ItemsDto item = ordersDto.getItem();

				PdfWriter.getInstance(document, response.getOutputStream());
				document.open();

				Font font = FontFactory.getFont(FontFactory.COURIER_BOLD);
				font.setSize(18);

				Font invoiceBillfont = FontFactory.getFont(FontFactory.COURIER);

				Font fontTitle = FontFactory.getFont(FontFactory.TIMES_ROMAN);
				fontTitle.setSize(20);

				Paragraph title = new Paragraph("Shopping Mart", fontTitle);
				title.setAlignment(Element.ALIGN_CENTER);

				Paragraph dots = new Paragraph(
						"------------------------------------------------------------------------------------------------------");
				dots.setAlignment(Element.ALIGN_CENTER);
				Paragraph dotsBig = new Paragraph(
						"-----------------------------------------------------------------------------------------------------------------------------");
				dots.setAlignment(Element.ALIGN_CENTER);

				Paragraph intro = new Paragraph("Your order details of " + item.getItemName(), font);
				intro.setAlignment(Element.ALIGN_LEFT);

				Paragraph userName = new Paragraph("Hi " + user.getUserName() + ",", invoiceBillfont);
				userName.setAlignment(Element.ALIGN_LEFT);

				Paragraph imagePara = new Paragraph();
				imagePara.setAlignment(Element.ALIGN_CENTER);
				try {
					Image image = Image.getInstance(item.getItemImgUrl());
					image.scalePercent(13);
					image.setAlignment(Element.ALIGN_CENTER);
					imagePara.add(image);
				} catch (Exception e) {
					 exceptionHandler.globalException(e);
				}
				Paragraph itemIntro = new Paragraph("	  The order of " + item.getItemName() + " with quantity of "
						+ ordersDto.getOrderQuantity() + " had " + ordersDto.getOrderStatus().toUpperCase(),
						invoiceBillfont);
				itemIntro.setAlignment(Element.ALIGN_LEFT);

				Paragraph tableInfo = new Paragraph("The delivery details of order is as below: ", invoiceBillfont);
				tableInfo.setAlignment(Element.ALIGN_LEFT);

				Font fontTable = FontFactory.getFont(FontFactory.COURIER_BOLD);

				PdfPTable table = new PdfPTable(3);
				table.setWidthPercentage(100f);
				table.setWidths(new int[] { 1, 3, 3 });
				table.setSpacingBefore(1);

				PdfPCell cells = new PdfPCell();
				cells.setPadding(5);

				cells.setPhrase(new Phrase("S.No", fontTable));
				table.addCell(cells);
				cells.setPhrase(new Phrase("Type", fontTable));
				table.addCell(cells);
				cells.setPhrase(new Phrase("Order details", fontTable));
				table.addCell(cells);

				table.addCell(String.valueOf(1));
				table.addCell("Full name");
				table.addCell(ordersDto.getFirstName() + " " + ordersDto.getLastName());
				table.addCell(String.valueOf(2));
				table.addCell("Email address");
				table.addCell(ordersDto.getEmailAddress()==""?"---":ordersDto.getEmailAddress());
				table.addCell(String.valueOf(3));
				table.addCell("Phone Number");
				table.addCell(ordersDto.getPhoneNumber());
				table.addCell(String.valueOf(4));
				table.addCell("Address");
				table.addCell(ordersDto.getDeliveryAddress());
				table.addCell(String.valueOf(5));
				table.addCell("Pincode");
				table.addCell(ordersDto.getPincode());
				table.addCell(String.valueOf(4));
				table.addCell("Delivered Date&Time");
				table.addCell("( IST ) " + ordersDto.getDeliveryDate() + " at " + ordersDto.getOrderedAt());
				table.addCell(String.valueOf(6));
				table.addCell("Quantity");
				table.addCell(String.valueOf(ordersDto.getOrderQuantity()));
				table.addCell(String.valueOf(7));
				table.addCell("Payment type");
				table.addCell(ordersDto.getPaymentType());
				table.addCell(String.valueOf(8));
				table.addCell("Cost of Item");
				String cost = "INR " + item.getItemPrice();
				Font fontAmount = FontFactory.getFont(FontFactory.COURIER_BOLD);
				table.addCell(new Phrase(cost, fontAmount));
				Phrase id = new Phrase(ordersDto.getOrderUUIDId().toString(), fontAmount);
				if (totalAmount == "" || totalAmount == null) {
					totalAmount = cost.replace("INR ", "").replace(".00", "");
				}
				Paragraph totalAmountPara = new Paragraph(
						"The total amount for this order is :" + cost + "(Item Cost)" + "x"
								+ ordersDto.getOrderQuantity() + "(Quantity) = 'INR " + totalAmount + ".00'",
						fontAmount);
				totalAmountPara.setAlignment(Element.ALIGN_RIGHT);

				Paragraph referenceId = new Paragraph("	  The reference of order is '" + id.getContent() + "'",
						invoiceBillfont);
				referenceId.setAlignment(Element.ALIGN_LEFT);

				Paragraph thankYou = new Paragraph("Thank_You from Shopping mart", font);
				thankYou.setAlignment(Element.ALIGN_CENTER);

				Paragraph createdBy = new Paragraph("Created By Raghavendra Machani", fontAmount);
				createdBy.setAlignment(Element.ALIGN_RIGHT);

				Paragraph invoiceBill = new Paragraph("Invoice Bill", invoiceBillfont);
				invoiceBill.setAlignment(Element.ALIGN_CENTER);

				document.add(invoiceBill);
				document.add(dotsBig);
				document.add(title);
				document.add(dots);
				document.add(intro);
				document.add(imagePara);
				document.add(userName);
				document.add(itemIntro);
				document.add(tableInfo);
				document.add(table);
				document.add(totalAmountPara);
				document.add(referenceId);
				document.add(dots);
				document.add(thankYou);
				document.add(dots);
				document.add(createdBy);
				document.add(dotsBig);
				document.close();
			} catch (Exception e) {
				exceptionHandler.globalException(e);
			}
		}
	}

}
