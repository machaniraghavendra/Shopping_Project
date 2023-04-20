package com.shopping.query.command.service;

import com.shopping.query.command.entites.BotEntity;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface BotService {
	void queryReponse(BotEntity incomeBot) throws UserNotFoundException;
}
