package com.shopping.query.command.entites.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdersDto {

	private String firstName;
	private String lastName;
	private String emailAddress;
	private String phoneNumber;
	private String pincode;
	private UUID deliveryAddress;
	private String paymentType;
	private String orderedOn;
	private String orderedAt;
	private Integer orderQuantity;
	private String deliveryDate;
	private String orderStatus;
	private UUID orderUUIDId;
	private String totalOrderAmount;
	private ItemsDto item;
	private String orderPlacedLocation;
}
