package com.shopping.query.command.service;

import com.shopping.query.command.exceptions.ItemNotFoundException;

public interface PurchaseService {

	void buyNow(String userId, int itemId) throws ItemNotFoundException;

	 Object getItem(String userId);
}
