package com.shopping.query.command.service.implementation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.CartEntity;
import com.shopping.query.command.entites.dto.CartDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.ItemAlreadyInCartException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInCartException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.CartRepo;
import com.shopping.query.command.service.CartService;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	private CartRepo cartRepo;

	@Autowired
	private MappersClass mapper;

	@Override
	public String save(CartEntity cartEntity) throws ItemAlreadyInCartException, ItemNotFoundException {

		String itemName = mapper.itemDtoMapper(cartEntity.getItemId()).getItemName();
		try {
			List<CartEntity> listEntity = cartRepo.findAll().stream()
					.filter(a -> a.getUserId().equalsIgnoreCase(cartEntity.getUserId()))
					.filter(a -> Objects.equals(a.getItemId(), cartEntity.getItemId())).collect(Collectors.toList());
			if (!listEntity.isEmpty()) {
				throw new ItemAlreadyInCartException("The item " + itemName + " already in your cart");
			} else {
				cartEntity.setCartId(cartEntity.getItemId());
				cartRepo.save(cartEntity);
				return "Added to your cart";
			}
		} catch (ItemAlreadyInCartException e) {
			e.printStackTrace();
		}
		return "The item " + itemName + " already in your cart";
	}

	@Override
	public String update(CartEntity cartEntity) throws ItemNotFoundInCartException, ItemNotFoundException {
		String itemName = mapper.itemDtoMapper(cartEntity.getItemId()).getItemName();
		try {
			if (!cartRepo.existsById(cartEntity.getCartId()))
				throw new ItemNotFoundInCartException("The item " + itemName + " not exists in your cart");
			else {
				cartRepo.save(cartEntity);
				return "Updated to your cart";
			}
		} catch (ItemNotFoundInCartException e) {
			e.printStackTrace();
		}
		return "The item " + itemName + " not exists in your cart";
	}

	@Override
	public String delete(int cartId) throws ItemNotFoundInCartException, ItemNotFoundException {
		String itemName = mapper.itemDtoMapper(cartId).getItemName();
		try {
			if (!cartRepo.existsById(cartId))
				throw new ItemNotFoundInCartException("The item " + itemName + " not exists in your cart");
			else {
				cartRepo.deleteById(cartId);
				return "The item " + itemName + " has been removed from your cart";
			}
		} catch (ItemNotFoundInCartException e) {
			e.printStackTrace();
		}
		return "The item " + cartId + " not exists in your cart";
	}

	@Override
	public CartDto find(int cartId) throws ItemNotFoundInCartException, UserNotFoundException, ItemNotFoundException {
		try {
			if (!cartRepo.existsById(cartId))
				throw new ItemNotFoundInCartException("The item " + cartId + " not exists in your cart");
			else {
				CartEntity cartEntity = cartRepo.findById(cartId).get();
				return CartDto.builder().user(mapper.userDetailDtoMapper(cartEntity.getUserId()))
						.item(mapper.itemDtoMapper(cartEntity.getItemId())).build();
			}
		} catch (ItemNotFoundInCartException e) {
			e.printStackTrace();
		}
		return new CartDto();
	}

	@Override
	public Map<UserDetailDto, ItemsDto> viewall() {
		Map<UserDetailDto, ItemsDto> listOfItems = new HashMap<>();
		List<CartEntity> itemEntities = cartRepo.findAll();
		if (Objects.nonNull(itemEntities)) {
			itemEntities.forEach(a -> {
				try {
					listOfItems.put(mapper.userDetailDtoMapper(a.getUserId()), mapper.itemDtoMapper(a.getItemId()));
				} catch (UserNotFoundException | ItemNotFoundException e) {
					e.printStackTrace();
				}
			});
		}
		return listOfItems;
	}

	// public String total() {
	// int amount=0;
	// List<CartEntity> list=cartRepo.findAll();
	// for (CartEntity cartEntity : list) {
	// amount
	// +=Integer.parseInt(cartEntity.getItemPrice().substring(1,cartEntity.getItemPrice().length()-3).replaceAll(",",
	// "").trim());
	// }
	// NumberFormat
	// format=NumberFormat.getCurrencyInstance(Locale.forLanguageTag("hi-IN"));
	// System.out.println(amount);
	//// return format.format(amount);
	// return Integer.toString(amount);
	// }
}
