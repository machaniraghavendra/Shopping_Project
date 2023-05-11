package com.shopping.query.command.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.AddressService;

@RestController
@RequestMapping("/address")
@CrossOrigin(origins = "*")
public class AddressController {

	@Autowired
	private AddressService service;

	@PostMapping("/")
	public ResponseEntity<List<Object>> saveAddress(@RequestBody AddressEntity addressEntity) {
		return ResponseEntity.ok(service.saveAddress(addressEntity));
	}

	@PutMapping("/")
	public ResponseEntity<List<Object>> updateAddress(@RequestBody AddressEntity addressEntity) {
		return ResponseEntity.ok(service.updateAddress(addressEntity));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<List<Object>> deleteAddress(@PathVariable Integer id) {
		return ResponseEntity.ok(service.deleteAddress(id));
	}
	
	@DeleteMapping("/{userId}/{address}")
	public ResponseEntity<String> deleteAddressWithUserIdAndAddress(@PathVariable String userId, @PathVariable String address) {
		return ResponseEntity.ok(service.deleteAddressWithUserIdAndAddress(userId,address));
	}

	@GetMapping("/address/{id}")
	public ResponseEntity<List<Object>> findAddressEntity(@PathVariable Integer id) {
		return ResponseEntity.ok(service.findAddressEntity(id));
	}

	@GetMapping("/{id}")
	public ResponseEntity<AddressDto> findAddress(@PathVariable Integer id) throws UserNotFoundException {
		return ResponseEntity.ok(service.findAddress(id));
	}

	@GetMapping("/")
	public ResponseEntity<List<AddressEntity>> viewAllAddress() {
		return ResponseEntity.ok(service.viewAllAddress());
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<List<AddressDto>> viewAllAddressWithUserId(@PathVariable String id) {
		return ResponseEntity.ok(service.viewAllAddressWithUserId(id));
	}

	@GetMapping("/{id}/{address}")
	public ResponseEntity<AddressDto> findAddressWithUserId(@PathVariable String id, @PathVariable String address) {
		return ResponseEntity.ok(service.findAddressWithUserId(id, address));
	}
}
