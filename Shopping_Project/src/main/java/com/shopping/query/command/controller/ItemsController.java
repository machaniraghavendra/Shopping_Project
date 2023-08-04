package com.shopping.query.command.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.service.ItemService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/items/")
@Tag (name= "Items", description = "Gives all items data")
public class ItemsController {

	@Autowired
	private ItemService itemService;

	@PostMapping("/")
	@Parameter(hidden = true, name = "Posting of single Item")
	public ResponseEntity<String> save(@RequestBody ItemEntity itemEntity) throws ItemAlreadyException {
		itemEntity.setItemId(itemService.viewall().stream().sorted(Comparator.comparing(ItemEntity::getItemId, Comparator.reverseOrder()))
				.toList().get(0).getItemId() + 1);
		return new ResponseEntity<>(itemService.save(itemEntity), HttpStatus.OK);
	}

	@PostMapping("/all")
	public ResponseEntity<String> saveall(@RequestBody List<ItemEntity> itemEntity) throws ItemAlreadyException {
		return new ResponseEntity<>(itemService.saveAll(itemEntity), HttpStatus.OK);
	}

	@PostMapping("/history")
	public ResponseEntity<Map<UUID, List<ItemsDto>>> viewedHistory(@RequestParam("userId") UUID userId,
			@RequestParam("id") int id) throws ItemNotFoundException {
		return new ResponseEntity<>(itemService.viewedHistory(userId, id), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<String> update(@RequestBody ItemEntity itemEntity) throws ItemNotFoundException {
		return new ResponseEntity<>(itemService.update(itemEntity), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> delete(@PathVariable("id") int itemId) throws ItemNotFoundException {
		return new ResponseEntity<>(itemService.delete(itemId), HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<String> deleteAll() throws ItemNotFoundException {
		return new ResponseEntity<>(itemService.deleteAll(), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<List<Object>> find(@PathVariable("id") int itemId) throws ItemNotFoundException {
		return new ResponseEntity<>(itemService.find(itemId), HttpStatus.OK);
	}

	@GetMapping("/")
	public ResponseEntity<List<ItemEntity>> viewall() {
		return new ResponseEntity<>(itemService.viewall(), HttpStatus.OK);
	}

	@GetMapping("/type")
	public ResponseEntity<List<ItemsDto>> getItemsByType(@RequestParam("type") String type) {
		return new ResponseEntity<>(itemService.getItemsByType(type), HttpStatus.OK);
	}

	@GetMapping("/trending")
	public ResponseEntity<List<ItemsDto>> getTrendingItems() {
		return new ResponseEntity<>(itemService.getTrendingItems(), HttpStatus.OK);
	}

	@GetMapping("/historyget")
	public ResponseEntity<List<ItemsDto>> getHistory(@RequestParam("userId") UUID userId) {
		return new ResponseEntity<>(itemService.getViewedHistory(userId), HttpStatus.OK);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<ItemsDto>> itemSearch(@RequestParam("query") String query) throws ItemNotFoundException {
		return new ResponseEntity<>(itemService.itemSearch(query), HttpStatus.OK);
	}
}
