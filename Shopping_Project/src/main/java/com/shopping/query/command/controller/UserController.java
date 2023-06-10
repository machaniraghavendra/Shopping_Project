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

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserAlreadyExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	private UserService userServiceImpl;

	@PostMapping("/")
	public ResponseEntity<String> save(@RequestBody UserEntity userEntity) throws UserAlreadyExistsException {
		return ResponseEntity.ok(userServiceImpl.save(userEntity));
	}

	@PutMapping("/")
	public ResponseEntity<String> update(@RequestBody UserEntity userEntity) throws UserNotFoundException {
		return ResponseEntity.ok(userServiceImpl.update(userEntity));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> delete(@PathVariable("id") String userEmail) throws UserNotFoundException {
		return ResponseEntity.ok(userServiceImpl.delete(userEmail));
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDetailDto> find(@PathVariable("id") String userEmail) throws UserNotFoundException {
		return ResponseEntity.ok(userServiceImpl.find(userEmail));
	}

	@GetMapping("/")
	public ResponseEntity<List<UserEntity>> findall() {
		return ResponseEntity.ok(userServiceImpl.findall());
	}
	
	@GetMapping("/theme/{useremail}")
	public ResponseEntity<Boolean> getTheme(@PathVariable("useremail") String userEmail) {
		return ResponseEntity.ok(userServiceImpl.getTheme(userEmail));
	}

	@GetMapping("/{useremail}/{password}")
	public ResponseEntity<Boolean> check(@PathVariable("useremail") String userEmail,
			@PathVariable("password") String userPassword) {
		return ResponseEntity.ok(userServiceImpl.check(userEmail, userPassword));
	}

}
