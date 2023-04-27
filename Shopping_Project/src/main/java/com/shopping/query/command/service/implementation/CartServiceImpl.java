package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.Arrays;
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
			List<CartEntity> listEntity = viewall().stream()
					.filter(a -> a.getUserId().equalsIgnoreCase(cartEntity.getUserId()))
					.filter(a -> Objects.equals(a.getItemId(), cartEntity.getItemId()))
					.collect(Collectors.toList());
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
	public List<CartEntity> viewall() {
		return cartRepo.findAll();
	}

	@Override
	public List<Map<String, List<ItemsDto>>> viewallMap() throws UserNotFoundException, ItemNotFoundException {
		List<Map<String, List<ItemsDto>>> list = new ArrayList<>();
		Map<String, List<ItemsDto>> item = new HashMap<>();
		List<CartEntity> itemEntities = viewall();
		if (Objects.nonNull(itemEntities)) {
			for (int i = 0; i < itemEntities.size(); i++) {
				String userEmail = mapper.userDetailDtoMapper(itemEntities.get(i).getUserId()).getUserEmail();
				ItemsDto itemsDto = mapper.itemDtoMapper(itemEntities.get(i).getItemId());
				if (adder(userEmail).isEmpty()) {
					item.put(userEmail, Arrays.asList(itemsDto));
				} else {
					List<ItemsDto> dtos = adder(userEmail);
					dtos.add(itemsDto);
					item.put(userEmail, dtos);
					item.get(userEmail).remove(itemsDto);
				}
			}
			list.add(item);
		}
		return list;
	}

	private List<ItemsDto> adder(String userId) {
		List<CartEntity> entities = viewall();
		return entities.stream().filter(a -> a.getUserId().equalsIgnoreCase(userId)).map(a -> {
			try {
				return mapper.itemDtoMapper(a.getItemId());
			} catch (ItemNotFoundException e) {
				e.printStackTrace();
			}
			return null;
		}).collect(Collectors.toList());
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
