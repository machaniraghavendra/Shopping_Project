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

import com.shopping.query.command.entites.ItemReview;
import com.shopping.query.command.entites.dto.ItemReviewDto;
import com.shopping.query.command.entites.dto.ReviewsCombinedDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemReviewNotExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.service.ItemReviewService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/review/")
@Tag(name = "We can review the item and add comments", description = "Get's, delete and post operations will be done here")
public class ItemReviewController {

	@Autowired
	private ItemReviewService reviewService;

	@PostMapping("/")
	public ResponseEntity<String> addComment(@RequestBody ReviewsCombinedDto combinedDto)
			throws ItemNotFoundException, UserException {
		return ResponseEntity.ok(reviewService.addComment(combinedDto));
	}

	@PutMapping("/")
	public ResponseEntity<List<Object>> updateComment(@RequestBody ItemReview itemReview) {
		return ResponseEntity.ok(reviewService.updateComment(itemReview));
	}

//	@DeleteMapping("/")
//	public ResponseEntity<String> deleteAllReviews() {
//		return ResponseEntity.ok(reviewService.deleteAllReviews());
//	}

	@DeleteMapping("/{reviewId}")
	public ResponseEntity<List<Object>> deleteComment(@PathVariable UUID reviewId) {
		return ResponseEntity.ok(reviewService.deleteComment(reviewId));
	}

	@GetMapping("/")
	public ResponseEntity<List<ItemReview>> getAllReviews() {
		return ResponseEntity.ok(reviewService.getAllReviews());
	}

	@GetMapping("/{reviewId}")
	public ResponseEntity<ItemReview> getReview(@PathVariable UUID reviewId) throws ItemReviewNotExistsException {
		return ResponseEntity.ok(reviewService.getReview(reviewId));
	}

	@GetMapping("/dto")
	public ResponseEntity<ItemReviewDto> getReviewDto(@RequestParam UUID reviewId) throws ItemReviewNotExistsException,
            UserException, ItemNotFoundException, RatingsOfUserNotFoundException {
		return ResponseEntity.ok(reviewService.getReviewDto(reviewId));
	}

	@GetMapping("/item")
	public ResponseEntity<List<ItemReviewDto>> getReviewsOfItem(@RequestParam int itemId) {
		return ResponseEntity.ok(reviewService.getReviewsOfItem(itemId));
	}
	
	@GetMapping("/images")
	public ResponseEntity<List<String>> getAllimages(@RequestParam int itemId) throws ItemNotFoundException {
		return ResponseEntity.ok(reviewService.getAllimages(itemId));
	}

	@GetMapping("/useritemreview/{itemId}")
	public ResponseEntity<List<ItemReviewDto>> getReviewsOfUser(@RequestParam UUID userId, @PathVariable int itemId) {
		return ResponseEntity.ok(reviewService.getReviewsOfUser(userId, itemId));
	}
}
