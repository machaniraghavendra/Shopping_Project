package com.shopping.query.command.service;

import java.util.List;

import com.shopping.query.command.entites.CartEntity;
import com.shopping.query.command.exceptions.ItemAlreadyInCartException;
import com.shopping.query.command.exceptions.ItemNotFoundInCartException;

public interface CartService {

	String save(CartEntity cartEntity) throws ItemAlreadyInCartException;

	String update(CartEntity cartEntity) throws ItemNotFoundInCartException;

	String delete(int cartId) throws ItemNotFoundInCartException;

	CartEntity find(int cartId) throws ItemNotFoundInCartException;

	List<CartEntity> viewall();

}
