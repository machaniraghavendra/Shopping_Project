package com.shopping.query.command.entites;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Orders")
public class OrdersEntity {

	@Id
	@GeneratedValue (strategy = GenerationType.AUTO)
	private Integer orderId;
	@NonNull
	private UUID userId;
	@NonNull
	private Integer itemId;
	@NonNull
	private String firstName;
	@NonNull
	private String pincode;
	@NonNull
	private String deliveryAddress;
	private String lastName;
	private String emailAddress;
	private String phoneNumber;
	private String paymentType;
	private String orderedOn;
	private String orderedAt;
	private Integer orderQuantity;
	private String deliveryDate;
	private String orderStatus;
	private UUID orderUUIDId;

}
