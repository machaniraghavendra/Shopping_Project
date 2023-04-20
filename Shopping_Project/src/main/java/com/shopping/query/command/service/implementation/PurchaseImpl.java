package com.shopping.query.command.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.service.PurchaseService;

@Service
public class PurchaseImpl implements PurchaseService {

	@Autowired
	private ItemServiceImpl itemServImpl;
	
	private List<Object> value;

	@Override
	public List<Object> buyNow(int itemId) throws ItemNotFoundException {
		value = itemServImpl.find(itemId);
		return value;
	}

	public List<Object> getItem() {
		return value;
	}

}
