package com.shopping.query.command.entites;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "Address_Details")
public class AddressEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer addressId;
	private UUID userId;
	private String deliveryAddress;
	private String pincode;
	private String phoneNumber;
	private String emailAddress;
	private String lastName;
	private String firstName;
	private UUID referenceId;
	private LocalDate addedOn;
}
