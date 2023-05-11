package com.shopping.query.command.service.implementation;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.service.PurchaseService;

@Service
public class PurchaseImpl implements PurchaseService {

	@Autowired
	private ItemServiceImpl itemServImpl;

	private Map<String, Object> value=new HashMap<>();

	@Override
	public void buyNow(String userId, int itemId) throws ItemNotFoundException {
		value.put(userId, itemServImpl.find(itemId));
	}

	@Override
	public Object getItem(String userId) {
		return value.get(userId);
	}

}
