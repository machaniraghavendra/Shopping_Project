package com.shopping.query.command.service.implementation;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.service.PurchaseService;

@Service
public class PurchaseImpl implements PurchaseService {

	@Autowired
	private ItemServiceImpl itemServImpl;

	private Map<UUID, Object> value=new HashMap<>();

	@Override
	public void buyNow(UUID userId, int itemId) throws ItemNotFoundException {
		value.put(userId, itemServImpl.find(itemId));
	}

	@Override
	public Object getItem(UUID userId) {
		return value.get(userId);
	}

}
