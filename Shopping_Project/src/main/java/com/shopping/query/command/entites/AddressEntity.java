package com.shopping.query.command.entites;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Builder
@Table(name = "Address_Details")
public class AddressEntity {
	@PrePersist
	public void prePersist(){
		if (Objects.isNull(referenceId)) this.referenceId= UUID.randomUUID();
		if (Objects.isNull(addedOn)) this.addedOn = LocalDate.now();
	}
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer addressId;
	private UUID userId;
	private String phoneNumber;
	private String emailAddress;
	private String lastName;
	private String firstName;
	private UUID referenceId;
	private LocalDate addedOn;
	@ManyToOne
	@JoinColumn(name = "DELIVERY_ADDRESS", updatable = false, referencedColumnName = "UUID")
	private CityAndPincode deliveryAddress;
}
