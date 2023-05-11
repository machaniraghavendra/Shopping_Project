package com.shopping.query.command.entites.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FavouriteDto {
	
	private ItemsDto item;
	private UserDetailDto user;
	
}
