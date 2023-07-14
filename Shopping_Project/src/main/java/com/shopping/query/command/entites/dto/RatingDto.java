package com.shopping.query.command.entites.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Builder
public class RatingDto {
	
	private int itemId;
	private UUID userId;
	private int rating;
	
}
