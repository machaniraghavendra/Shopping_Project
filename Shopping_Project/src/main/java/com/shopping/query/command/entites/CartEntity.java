package com.shopping.query.command.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	private int cartId;
	@Column(name = "itemId")
	private int ItemId;
	private String ItemType;
	private String itemName;
	private String ItemImgUrl;
	private String ItemPrice;
	private String ItemDesc;
	private String ItemSpec;
	private String ItemDimensions;
	private String userId;

}