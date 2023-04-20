package com.shopping.query.command.service;

import java.util.List;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.exceptions.ItemAlreadyException;
import com.shopping.query.command.exceptions.ItemNotFoundException;

public interface ItemService {
	String save(ItemEntity itemEntity) throws ItemAlreadyException;

	String saveAll(List<ItemEntity> itemEntity) throws ItemAlreadyException;

	String update(ItemEntity itemEntity) throws ItemNotFoundException;

	String delete(int itemId) throws ItemNotFoundException;

	String deleteAll();

	List<Object> find(int itemId) throws ItemNotFoundException;

	List<ItemEntity> viewall();
}
