package com.shopping.query.command.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.service.implementation.PurchaseImpl;

import io.swagger.annotations.Api;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/purchase")
@Api(tags = "Which item wants to purchase", description = "Shows the item which you want to purchase")
public class PurchaseController {

	@Autowired
	PurchaseImpl purchaseImpl;

	@GetMapping("/{itemId}")
	public ResponseEntity<List<Object>> purchaseItem(@PathVariable int itemId) throws ItemNotFoundException {
		return ResponseEntity.ok(purchaseImpl.buyNow(itemId));
	}

	@GetMapping("/")
	public ResponseEntity<List<Object>> getItem() {
		return ResponseEntity.ok(purchaseImpl.getItem());
	}
}
