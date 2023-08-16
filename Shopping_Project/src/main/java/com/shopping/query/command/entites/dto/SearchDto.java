package com.shopping.query.command.entites.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchDto {
	
	private Integer count;
	private String query;
	private List<ItemsDto> actualResult;
	private List<ItemsDto> relatedResult;
	private List<ItemsDto> suggestions;
}
