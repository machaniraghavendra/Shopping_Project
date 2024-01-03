package com.shopping.query.command.entites.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressDto {

	private UUID deliveryAddressUuid;
	private String deliveryAddress;
	private String phoneNumber;
	private String emailAddress;
	private String lastName;
	private String firstName;
	private UUID referenceId;
	private UUID userId;
	private LocalDate addedOn;
}
