package com.shopping.query.command.entites;

import java.util.UUID;

import jakarta.persistence.*;
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
	@GeneratedValue (strategy = GenerationType.SEQUENCE)
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
	private UUID deliveryAddress;
	private String lastName;
	private String emailAddress;
	private String phoneNumber;
	private String paymentType;
	private String orderedOn;
	private String orderedAt;
	private Integer orderQuantity;
	private String deliveryDate;
	private String orderStatus;
	@Column(columnDefinition = "binary(16)")
	private UUID orderUUIDId;
	private String totalOrderAmount;
}
