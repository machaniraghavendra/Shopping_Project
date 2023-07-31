package com.shopping.query.command.mapper;

import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.RatingsOfUser;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.entites.dto.RatingDto;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.RatingsService;
import com.shopping.query.command.service.implementation.ItemServiceImpl;
import com.shopping.query.command.service.implementation.UserServiceImpl;

@Service
public class MappersClass {

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private ItemServiceImpl itemServiceImpl;

	@Autowired
	private RatingsService ratingsService;

	public UserDetailDto userDetailDtoMapper(UUID userId) throws UserNotFoundException {
		UserDetailDto userEntity = userService.getUserWithId(userId);
		if (Objects.isNull(userEntity))
			return new UserDetailDto();
		return userEntity;
	}

	public ItemsDto itemDtoMapperById(int itemId) throws ItemNotFoundException {
		ItemEntity itemEntity = (ItemEntity) itemServiceImpl.find(itemId).get(0);
		if (Objects.isNull(itemEntity))
			return new ItemsDto();
		return ItemsDto.builder().itemName(itemEntity.getItemName()).ItemDesc(itemEntity.getItemDesc())
				.ItemDimensions(itemEntity.getItemDimensions()).ItemImgUrl(itemEntity.getItemImgUrl())
				.ItemPrice(itemEntity.getItemPrice()).itemId(itemEntity.getItemId()).ItemSpec(itemEntity.getItemSpec())
				.ItemType(itemEntity.getItemType()).isTrending(itemEntity.isTrending())
				.ratingOfItem(itemEntity.getRatingOfItem()).build();
	}

	public ItemsDto itemDtoMapperByEntity(ItemEntity itemEntity) throws ItemNotFoundException {
		if (Objects.isNull(itemEntity))
			return new ItemsDto();
		return ItemsDto.builder().itemName(itemEntity.getItemName()).ItemDesc(itemEntity.getItemDesc())
				.ItemDimensions(itemEntity.getItemDimensions()).ItemImgUrl(itemEntity.getItemImgUrl())
				.ItemPrice(itemEntity.getItemPrice()).itemId(itemEntity.getItemId()).ItemSpec(itemEntity.getItemSpec())
				.ItemType(itemEntity.getItemType()).isTrending(itemEntity.isTrending())
				.ratingOfItem(itemEntity.getRatingOfItem()).build();
	}

	public OrdersDto deliveryDetailsMapper(OrdersEntity ordersEntity) throws ItemNotFoundException {
		if (Objects.isNull(ordersEntity)) {
			return new OrdersDto();
		}
		return OrdersDto.builder().deliveryAddress(ordersEntity.getDeliveryAddress())
				.deliveryDate(ordersEntity.getDeliveryDate()).emailAddress(ordersEntity.getEmailAddress())
				.firstName(ordersEntity.getFirstName()).item(itemDtoMapperById(ordersEntity.getItemId()))
				.lastName(ordersEntity.getLastName()).orderedAt(ordersEntity.getOrderedAt())
				.orderedOn(ordersEntity.getOrderedOn()).orderQuantity(ordersEntity.getOrderQuantity())
				.orderStatus(ordersEntity.getOrderStatus()).paymentType(ordersEntity.getPaymentType())
				.phoneNumber(ordersEntity.getPhoneNumber()).pincode(ordersEntity.getPincode())
				.orderUUIDId(ordersEntity.getOrderUUIDId()).totalOrderAmount(ordersEntity.getTotalOrderAmount()).build();
	}

	public AddressDto addressDtoMapper(AddressEntity addressEntity) throws UserNotFoundException {
		return AddressDto.builder().deliveryAddress(addressEntity.getDeliveryAddress())
				.pincode(addressEntity.getPincode()).userDetails(userDetailDtoMapper(addressEntity.getUserId()))
				.emailAddress(addressEntity.getEmailAddress()).firstName(addressEntity.getFirstName())
				.lastName(addressEntity.getLastName()).phoneNumber(addressEntity.getPhoneNumber())
				.referenceId(addressEntity.getReferenceId()).build();
	}

	public AddressDto mapAddressDtoWithOrdersEntity(OrdersEntity ordersEntity) throws UserNotFoundException {
		if (Objects.isNull(ordersEntity)) {
			return null;
		}
		return AddressDto.builder().deliveryAddress(ordersEntity.getDeliveryAddress())
				.emailAddress(ordersEntity.getEmailAddress()).firstName(ordersEntity.getFirstName())
				.lastName(ordersEntity.getLastName()).phoneNumber(ordersEntity.getPhoneNumber())
				.pincode(ordersEntity.getPincode()).userDetails(userDetailDtoMapper(ordersEntity.getUserId())).build();
	}

	public RatingDto mapRatingsOfUserWithdto(RatingsOfUser ratings) {
		if (Objects.isNull(ratings)) {
			return null;
		}
		return RatingDto.builder().itemId(ratings.getItemId()).userId(ratings.getUserId()).rating(ratings.getRating())
				.build();
	}

	public RatingDto mapRatingsOfUserWithdto(UUID ratingId) throws RatingsOfUserNotFoundException {
		if (Objects.isNull(ratingId)) {
			return null;
		}
		RatingsOfUser ratings = ratingsService.getRatingWithRatingId(ratingId);
		return RatingDto.builder().itemId(ratings.getItemId()).userId(ratings.getUserId()).rating(ratings.getRating())
				.build();
	}

}
