package com.shopping.query.command.controller;

import java.util.List;
import java.util.Map;

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

import com.shopping.query.command.entites.FavouritesEntity;
import com.shopping.query.command.entites.dto.FavouriteDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyInFavException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInFavException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.service.FavService;

@RestController
@RequestMapping("/fav")
@CrossOrigin(origins = "*")
public class FavController {

	@Autowired
	private FavService favServiceImpl;

	@PostMapping("/")
	public ResponseEntity<String> save(@RequestBody FavouritesEntity favEntity)
			throws ItemAlreadyInFavException, ItemNotFoundException {
		return ResponseEntity.ok(favServiceImpl.save(favEntity));
	}

	@PutMapping("/")
	public ResponseEntity<String> update(@RequestBody FavouritesEntity favEntity)
			throws ItemNotFoundInFavException, ItemNotFoundException {
		return  ResponseEntity.ok(favServiceImpl.update(favEntity));
	}

	@DeleteMapping("/{itemName}")
	public ResponseEntity<String> delete(@PathVariable("itemName") String itemName, @RequestParam String userEmail)
			throws ItemNotFoundInFavException, ItemNotFoundException {
		return  ResponseEntity.ok(favServiceImpl.delete(itemName, userEmail));
	}

	@GetMapping("/{id}")
	public ResponseEntity<FavouriteDto> find(@PathVariable("id") int favId)
			throws ItemNotFoundInFavException, UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(favServiceImpl.find(favId));
	}

	@GetMapping("/map")
	public ResponseEntity<List<Map<String, List<ItemsDto>>>> viewallMap()
			throws UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(favServiceImpl.viewallMap());
	}

	@GetMapping("/userId/{userid}")
	public ResponseEntity<List<List<ItemsDto>>> getListofCartItemswithUserId(@PathVariable("userid") String userid)
			throws UserNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(favServiceImpl.getListofFavItemswithUserId(userid));
	}

	@GetMapping("/")
	public ResponseEntity<List<FavouritesEntity>> viewall() {
		return  ResponseEntity.ok(favServiceImpl.viewall());
	}

}
