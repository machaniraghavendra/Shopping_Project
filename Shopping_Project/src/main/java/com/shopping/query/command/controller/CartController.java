package com.shopping.query.command.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

	@Autowired
	private CartService cartServiceImpl;

	@PostMapping("/")
	public ResponseEntity<String> save(@RequestBody CartEntity cartEntity)
			throws ItemAlreadyInCartException, ItemNotFoundException {
		return new ResponseEntity<String>(cartServiceImpl.save(cartEntity), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<String> update(@RequestBody CartEntity cartEntity)
			throws ItemNotFoundInCartException, ItemNotFoundException {
		return new ResponseEntity<String>(cartServiceImpl.update(cartEntity), HttpStatus.OK);
	}

	@DeleteMapping("/{itemName}")
	public ResponseEntity<String> delete(@PathVariable("itemName") String itemName, @RequestParam String userEmail)
			throws ItemNotFoundInCartException, ItemNotFoundException {
		return new ResponseEntity<String>(cartServiceImpl.delete(itemName, userEmail), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CartDto> find(@PathVariable("id") int cartId)
			throws ItemNotFoundInCartException, UserNotFoundException, ItemNotFoundException {
		return new ResponseEntity<CartDto>(cartServiceImpl.find(cartId), HttpStatus.OK);
	}

	@GetMapping("/map")
	public ResponseEntity<List<Map<String, List<ItemsDto>>>> viewallMap() throws UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.viewallMap());
	}
	
	@GetMapping("/userId/{userid}")
	public ResponseEntity<List<List<ItemsDto>>> getListofCartItemswithUserId(@PathVariable("userid") String userid) throws UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(cartServiceImpl.getListofCartItemswithUserId(userid));
	}

	@GetMapping("/")
	public ResponseEntity<List<CartEntity>> viewall() {
		return new ResponseEntity<List<CartEntity>>(cartServiceImpl.viewall(), HttpStatus.OK);
	}

}
