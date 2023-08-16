package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
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

		String itemName = mapper.itemDtoMapperById(cartEntity.getItemId()).getItemName();
		try {
			List<CartEntity> listEntity = viewall().stream().filter(a -> a.getUserId().equals(cartEntity.getUserId()))
					.filter(a -> Objects.equals(a.getItemId(), cartEntity.getItemId())).collect(Collectors.toList());
			if (!listEntity.isEmpty()) {
				throw new ItemAlreadyInCartException("The item " + itemName + " already in your cart");
			} else {
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
		String itemName = mapper.itemDtoMapperById(cartEntity.getItemId()).getItemName();
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
	public String delete(String itemName, UUID userId) throws ItemNotFoundInCartException, ItemNotFoundException {
		Integer itemId = checkandgetlistWithUserId(userId).stream()
				.filter(a -> a.getItemName().equalsIgnoreCase(itemName)).map(a -> a.getItemId()).findFirst().get();
		CartEntity cartEntity = viewall().stream().filter(a -> a.getItemId() == itemId).findFirst().get();
		try {
			if (!cartRepo.existsById(cartEntity.getCartId()))
				throw new ItemNotFoundInCartException("The item " + itemName + " not exists in your cart");
			else {
				cartRepo.deleteById(cartEntity.getCartId());
				return "The item " + itemName + " has been removed from your cart";
			}
		} catch (ItemNotFoundInCartException e) {
			e.printStackTrace();
		}
		return "The item " + itemName + " not exists in your cart";
	}

	@Override
	public CartDto find(int cartId) throws ItemNotFoundInCartException, UserNotFoundException, ItemNotFoundException {
		try {
			if (!cartRepo.existsById(cartId))
				throw new ItemNotFoundInCartException("The item " + cartId + " not exists in your cart");
			else {
				CartEntity cartEntity = cartRepo.findById(cartId).get();
				return CartDto.builder().user(mapper.userDetailDtoMapper(cartEntity.getUserId()))
						.item(mapper.itemDtoMapperById(cartEntity.getItemId())).build();
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
	public List<Map<UUID, List<ItemsDto>>> viewallMap() throws UserNotFoundException, ItemNotFoundException {
		List<Map<UUID, List<ItemsDto>>> list = new ArrayList<>();
		Map<UUID, List<ItemsDto>> item = new HashMap<>();
		List<CartEntity> itemEntities = viewall();
		if (Objects.nonNull(itemEntities)) {
			for (int i = 0; i < itemEntities.size(); i++) {
				UUID userId = mapper.userDetailDtoMapper(itemEntities.get(i).getUserId()).getUserId();
				ItemsDto itemsDto = mapper.itemDtoMapperById(itemEntities.get(i).getItemId());
				if (checkandgetlistWithUserId(userId).isEmpty()) {
					item.put(userId, Arrays.asList(itemsDto));
				} else {
					List<ItemsDto> dtos = checkandgetlistWithUserId(userId);
					dtos.add(itemsDto);
					item.put(userId, dtos);
					item.get(userId).remove(itemsDto);
				}
			}
			list.add(item);
		}
		return list;
	}

	@Override
	public void deleteAllCartItemsOfUser(UUID userId) throws UserNotFoundException {
		try {
			cartRepo.deleteAll(viewall().stream().filter(a -> a.getUserId().equals(userId)).toList());
		} catch (Exception e) {
			throw new UserNotFoundException(e.getMessage());
		}
	}

	private List<ItemsDto> checkandgetlistWithUserId(UUID userId) {
		List<CartEntity> entities = viewall();
		return entities.stream().filter(a -> a.getUserId().equals(userId)).map(a -> {
			try {
				return mapper.itemDtoMapperById(a.getItemId());
			} catch (ItemNotFoundException e) {
				e.printStackTrace();
			}
			return null;
		}).collect(Collectors.toList());
	}

	@Override
	public List<List<ItemsDto>> getListofCartItemswithUserId(UUID userId)
			throws UserNotFoundException, ItemNotFoundException {
		return viewallMap().stream().map(a -> {
			if (a.containsKey(userId)) {
				return a.get(userId);
			} else {
				return null;
			}
		}).toList();
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
