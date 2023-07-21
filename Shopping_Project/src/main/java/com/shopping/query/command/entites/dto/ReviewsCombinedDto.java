package com.shopping.query.command.entites.dto;

import java.util.List;

import com.shopping.query.command.entites.ItemReview;
import com.shopping.query.command.entites.ReviewImages;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ReviewsCombinedDto {

	private ItemReview itemReview;
	private List<String> imageUrls;
}
