package com.shopping.query.command.entites;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@Entity
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDetailsOfUserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer orderId;
	private UUID uuidId;
	private UserEntity userDetails;
	@OneToMany(targetEntity = ItemEntity.class, fetch = FetchType.EAGER)
	private List<Object> itemEntity;
	private String firstName = "", lastName = "", emailAddress = "", phoneNumber = "", pincode = "",
			deliveryAddress = "", paymentType = "";
	private String orderedOn;
	private String orderedAt;
	private int orderQuantity;
	private String deliveryDate;
	private String orderStatus;
}
