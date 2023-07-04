package com.shopping.query.command.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.CartEntity;
import com.shopping.query.command.entites.dto.CartDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyInCartException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInCartException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.CartService;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

	@Autowired
	private CartService cartServiceImpl;

	@PostMapping("/")
	public ResponseEntity<String> save(@RequestBody CartEntity cartEntity)
			throws ItemAlreadyInCartException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.save(cartEntity));
	}

	@PutMapping("/")
	public ResponseEntity<String> update(@RequestBody CartEntity cartEntity)
			throws ItemNotFoundInCartException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.update(cartEntity));
	}

	@DeleteMapping("/{itemName}")
	public ResponseEntity<String> delete(@PathVariable("itemName") String itemName, @RequestParam UUID userId)
			throws ItemNotFoundInCartException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.delete(itemName, userId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<CartDto> find(@PathVariable("id") int cartId)
			throws ItemNotFoundInCartException, UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.find(cartId));
	}

	@GetMapping("/map")
	public ResponseEntity<List<Map<UUID, List<ItemsDto>>>> viewallMap()
			throws UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.viewallMap());
	}

	@GetMapping("/userId/{userid}")
	public ResponseEntity<List<List<ItemsDto>>> getListofCartItemswithUserId(@PathVariable("userid") UUID userid)
			throws UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.getListofCartItemswithUserId(userid));
	}

	@GetMapping("/")
	public ResponseEntity<List<CartEntity>> viewall() {
		return ResponseEntity.ok(cartServiceImpl.viewall());
	}

}
