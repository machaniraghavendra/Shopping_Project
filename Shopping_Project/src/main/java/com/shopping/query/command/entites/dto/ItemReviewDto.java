package com.shopping.query.command.entites.dto;

import java.util.List;

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
public class ItemReviewDto {

	private int itemId;
	private UserDetailDto user;
	private String comment;
	private String commentTitle;
	private String commentAddedOn;
	private String commentAddedAt;
	private List<ReviewImageDto> imageDto;
	private RatingDto rating;

}
