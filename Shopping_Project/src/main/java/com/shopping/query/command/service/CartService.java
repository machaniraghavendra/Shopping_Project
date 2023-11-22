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
import com.shopping.query.command.exceptions.UserException;

public interface CartService {

	String save(CartEntity cartEntity) throws ItemAlreadyInCartException, ItemNotFoundException;

	String update(CartEntity cartEntity) throws ItemNotFoundInCartException, ItemNotFoundException;

	String delete(String itemName, UUID userEmail) throws ItemNotFoundInCartException, ItemNotFoundException;

	CartDto find(int cartId) throws ItemNotFoundInCartException, UserException, ItemNotFoundException;

	List<CartEntity> viewall();

	void deleteAllCartItemsOfUser(UUID userId) throws UserException;
	
	List<Map<UUID, List<ItemsDto>>> viewallMap() throws UserException, ItemNotFoundException;

	List<List<ItemsDto>> getListofCartItemswithUserId(UUID userId)
			throws UserException, ItemNotFoundException;
}
