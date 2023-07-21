package com.shopping.query.command.entites.dto;

import java.util.UUID;

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
public class ReviewImageDto {
	
	private String imageUrl;
	private int itemId;
	private UUID reviewId;
}
