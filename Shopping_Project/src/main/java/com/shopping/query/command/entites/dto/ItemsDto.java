package com.shopping.query.command.entites.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ItemsDto {

	private Integer itemId;
	private String ItemType;
	private String itemName;
	private String ItemImgUrl;
	private String ItemPrice;
	private String ItemDesc;
	private String ItemSpec;
	private String ItemDimensions;
	private boolean isTrending;
	private float ratingOfItem;
	private int totalReviews;
	private int totalOrders;
}
