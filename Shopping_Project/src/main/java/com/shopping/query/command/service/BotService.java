package com.shopping.query.command.service;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.BotEntity;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface BotService {
	
	void queryReponse(BotEntity incomeBot) throws UserNotFoundException, ItemNotFoundException;
	
	void listClear(UUID userEmail) ;
	
	List<BotEntity> viewAllResponse() ;
	
	String getOrderDetailsWithUUID(UUID userId, UUID id) throws ItemNotFoundException, OrderNotFoundException;
}
