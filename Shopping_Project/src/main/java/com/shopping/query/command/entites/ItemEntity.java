package com.shopping.query.command.entites;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = ItemEntity.tableName)
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ItemEntity {

	static final String tableName = "ITEMS";

	@Id
	private int ItemId;
	private String ItemType;
	private String itemName;
	private String ItemImgUrl;
	private String ItemPrice;
	private String ItemDesc;
	private String ItemSpec;
	private String ItemDimensions;
	private boolean isTrending;
	private LocalDateTime itemAddedOn;
	private LocalDateTime itemUpdatedOn;
	private float ratingOfItem;
}
