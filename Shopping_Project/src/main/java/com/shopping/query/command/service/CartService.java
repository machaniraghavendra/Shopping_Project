package com.shopping.query.command.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.shopping.query.command.entites.CartEntity;
import com.shopping.query.command.entites.dto.CartDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyInCartException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInCartException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface CartService {

	String save(CartEntity cartEntity) throws ItemAlreadyInCartException, ItemNotFoundException;

	String update(CartEntity cartEntity) throws ItemNotFoundInCartException, ItemNotFoundException;

	String delete(String itemName, UUID userEmail) throws ItemNotFoundInCartException, ItemNotFoundException;

	CartDto find(int cartId) throws ItemNotFoundInCartException, UserNotFoundException, ItemNotFoundException;

	List<CartEntity> viewall();

	List<Map<UUID, List<ItemsDto>>> viewallMap() throws UserNotFoundException, ItemNotFoundException;

	List<List<ItemsDto>> getListofCartItemswithUserId(UUID userId)
			throws UserNotFoundException, ItemNotFoundException;
}
