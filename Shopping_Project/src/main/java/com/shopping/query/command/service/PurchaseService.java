package com.shopping.query.command.service;

import java.util.List;

import com.shopping.query.command.exceptions.ItemNotFoundException;

public interface PurchaseService {

	List<Object> buyNow(int itemId) throws ItemNotFoundException;
}
