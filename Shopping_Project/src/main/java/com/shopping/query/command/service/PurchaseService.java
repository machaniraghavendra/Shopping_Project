package com.shopping.query.command.service;

import java.util.UUID;

import com.shopping.query.command.exceptions.ItemNotFoundException;

public interface PurchaseService {

	void buyNow(UUID userId, int itemId) throws ItemNotFoundException;

	 Object getItem(UUID userId);
}
