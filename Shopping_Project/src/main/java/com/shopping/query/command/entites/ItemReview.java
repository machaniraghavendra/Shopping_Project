package com.shopping.query.command.entites;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class ItemReview {

	@Id
	private UUID reviewId;
	private int itemId;
	private UUID userId;
	private String commentTitle;
	private String comment;
	private String commentAddedOn;
	private String commentAddedAt;
}
