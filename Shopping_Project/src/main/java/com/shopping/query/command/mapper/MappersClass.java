package com.shopping.query.command.mapper;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.implementation.ItemServiceImpl;
import com.shopping.query.command.service.implementation.UserServiceImpl;

@Service
public class MappersClass {

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private ItemServiceImpl itemServiceImpl;

	public UserDetailDto userDetailDtoMapper(String userEmail) throws UserNotFoundException {
		UserDetailDto userEntity = userService.find(userEmail);
		if (Objects.isNull(userEntity)) 
			return new UserDetailDto();
		return userEntity;
	}

	public ItemsDto itemDtoMapper(int itemId) throws ItemNotFoundException {
		ItemEntity itemEntity = (ItemEntity) itemServiceImpl.find(itemId).get(0);
		if (Objects.isNull(itemEntity)) 
			return new ItemsDto();
		return ItemsDto.builder().itemName(itemEntity.getItemName()).ItemDesc(itemEntity.getItemDesc())
				.ItemDimensions(itemEntity.getItemDimensions()).itemId(itemEntity.getItemId())
				.ItemImgUrl(itemEntity.getItemImgUrl()).ItemPrice(itemEntity.getItemPrice())
				.ItemSpec(itemEntity.getItemSpec()).ItemType(itemEntity.getItemType()).build();

	}
}
