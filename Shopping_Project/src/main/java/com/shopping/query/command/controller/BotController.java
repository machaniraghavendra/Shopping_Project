package com.shopping.query.command.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.BotEntity;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.BotService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/bot/")
public class BotController {

	@Autowired
	private BotService botServiceImpl;

	@PostMapping("/")
	public void getResponse(@RequestBody BotEntity bot) throws UserNotFoundException, ItemNotFoundException {
		String messageArray[]=bot.getUserMessage().split(" ");
		for (int i = 0; i < messageArray.length; i++) {
			if (messageArray[i].length()>20) {
				bot.setUserMessage(messageArray[i]);
				break;
			}
		}
		botServiceImpl.queryReponse(bot);
	}

	@GetMapping("/")
	public ResponseEntity<List<BotEntity>> viewAllResponse() {
		return ResponseEntity.ok(botServiceImpl.viewAllResponse());
	}

	@PostMapping("/{userId}")
	public void listClear(@PathVariable UUID userId) {
		botServiceImpl.listClear(userId);
	}
	
}
