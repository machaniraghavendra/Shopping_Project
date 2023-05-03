package com.shopping.query.command.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Table(name = "CartDetails")
public class CartEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int cartId;
	private int ItemId;
	private String userId;

}