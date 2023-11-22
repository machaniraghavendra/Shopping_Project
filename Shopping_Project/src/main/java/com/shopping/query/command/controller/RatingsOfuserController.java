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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.RatingsOfUser;
import com.shopping.query.command.entites.dto.RatingDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.RatingsOfUserAlreadyExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.service.RatingsService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/rating")
@Tag(name = "Giving rating to item after delivered", description = "Get's, delete and post operations will be done here")
public class RatingsOfuserController {

	@Autowired
	private RatingsService ratingsService;

	@PostMapping("/")
	public ResponseEntity<Object> saveRating(@RequestBody RatingsOfUser ratings)
			throws RatingsOfUserAlreadyExistsException, RatingsOfUserNotFoundException, UserException,
			ItemNotFoundException {
		return ResponseEntity.ok(ratingsService.saveRating(ratings));
	}

	@PutMapping("/")
	public ResponseEntity<Object> updateRating(@RequestBody RatingsOfUser ratings)
			throws RatingsOfUserNotFoundException {
		return ResponseEntity.ok(ratingsService.updateRating(ratings));
	}

	@DeleteMapping("/user/{userId}")
	public ResponseEntity<Object> deleteRating(@PathVariable("userId") UUID userId, @RequestParam int itemId)
			throws RatingsOfUserNotFoundException, UserException, ItemNotFoundException {
		return ResponseEntity.ok(ratingsService.delete(userId, itemId));
	}

	@DeleteMapping("/")
	public ResponseEntity<String> deleteAllRatings() {
		return ResponseEntity.ok(ratingsService.deleteAllratings());
	}

	@GetMapping("/")
	public ResponseEntity<List<RatingsOfUser>> getAllRatings() {
		return ResponseEntity.ok(ratingsService.getAllRatings());
	}

	@GetMapping("/id")
	public ResponseEntity<RatingsOfUser> getRatingWithRatingId(@RequestParam("ratingId") UUID ratingId)
			throws RatingsOfUserNotFoundException {
		return ResponseEntity.ok(ratingsService.getRatingWithRatingId(ratingId));
	}

	@GetMapping("/withuseritem")
	public ResponseEntity<RatingsOfUser> getRatingOfUserWithuserIdAndItemId(@RequestParam("userId") UUID userId,
			@RequestParam("itemId") int itemId)
			throws RatingsOfUserNotFoundException, UserException, ItemNotFoundException {
		return ResponseEntity.ok(ratingsService.getRatingOfUserWithuserIdAndItemId(userId, itemId));
	}

	@GetMapping("user/{userId}/{itemId}")
	public ResponseEntity<RatingDto> getRatingWithuserIdAndItemId(@PathVariable("userId") UUID userId,
			@PathVariable("itemId") int itemId)
			throws RatingsOfUserNotFoundException, UserException, ItemNotFoundException {
		return ResponseEntity.ok(ratingsService.getRatingWithuserIdAndItemId(userId, itemId));
	}
	
	@GetMapping("userId/{userId}")
	public ResponseEntity<List<Object>> getRatingWithuserId(@PathVariable("userId") UUID userId)
			throws RatingsOfUserNotFoundException, UserException {
		return ResponseEntity.ok(ratingsService.getRatingWithuserId(userId));
	}
}
