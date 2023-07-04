package com.shopping.query.command.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.service.PurchaseService;

import io.swagger.annotations.Api;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/purchase")
@Api(tags = "Which item wants to purchase", description = "Shows the item which you want to purchase")
public class PurchaseController {

	@Autowired
	private PurchaseService purchaseImpl;

	@PostMapping("/{itemId}")
	public void purchaseItem(@RequestParam UUID userId,@PathVariable int itemId) throws ItemNotFoundException {
		purchaseImpl.buyNow(userId,itemId);
	}

	@GetMapping("/")
	public ResponseEntity<Object> getItem(@RequestParam UUID userId) {
		return ResponseEntity.ok(purchaseImpl.getItem(userId));
	}
}
