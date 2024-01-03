package com.shopping.query.command.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.service.AddressService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/address")
@Tag(name = "Saved Address of user", description = "Gets and posting will be done in this controller of address")
public class AddressController {

	@Autowired
	private AddressService service;

	@PostMapping("/")
	public ResponseEntity<List<Object>> saveAddress(@RequestBody AddressDto address) {
		return ResponseEntity.ok(service.saveAddress(address));
	}

	@PutMapping("/")
	public ResponseEntity<List<Object>> updateAddress(@RequestBody AddressEntity addressEntity) {
		return ResponseEntity.ok(service.updateAddress(addressEntity));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<List<Object>> deleteAddress(@PathVariable Integer id) {
		return ResponseEntity.ok(service.deleteAddress(id));
	}
	
	@DeleteMapping("withreference/{referenceid}")
	public ResponseEntity<String> deleteAddressWithUserIdAndAddress(@PathVariable UUID referenceid) {
		return ResponseEntity.ok(service.deleteAddressWithReferenceId(referenceid));
	}

	@GetMapping("/address/{id}")
	public ResponseEntity<List<Object>> findAddressEntity(@PathVariable Integer id) {
		return ResponseEntity.ok(service.findAddressEntity(id));
	}

	@GetMapping("/{id}")
	public ResponseEntity<AddressDto> findAddress(@PathVariable Integer id) throws UserException {
		return ResponseEntity.ok(service.findAddress(id));
	}

	@GetMapping("/")
	public ResponseEntity<List<AddressEntity>> viewAllAddress() {
		return ResponseEntity.ok(service.viewAllAddress());
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<List<AddressDto>> viewAllAddressWithUserId(@PathVariable UUID id) {
		return ResponseEntity.ok(service.viewAllAddressWithUserId(id));
	}

	@GetMapping("/{id}/{address}")
	public ResponseEntity<AddressDto> findAddressWithUserId(@PathVariable UUID id, @PathVariable UUID address) {
		return ResponseEntity.ok(service.findAddressWithUserId(id, address));
	}
}
