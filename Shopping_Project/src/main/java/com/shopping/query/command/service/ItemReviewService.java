package com.shopping.query.command.service;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.ItemReview;
import com.shopping.query.command.entites.dto.ItemReviewDto;
import com.shopping.query.command.entites.dto.ReviewsCombinedDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemReviewNotExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface ItemReviewService {

	String addComment(ReviewsCombinedDto combinedDto)
			throws ItemNotFoundException, UserNotFoundException;

	List<Object> updateComment(ItemReview itemReview);

	ItemReview getReview(UUID reviewId) throws ItemReviewNotExistsException;

	ItemReviewDto getReviewDto(UUID reviewId) throws ItemReviewNotExistsException, UserNotFoundException, ItemNotFoundException, RatingsOfUserNotFoundException;

	List<ItemReviewDto> getReviewsOfItem(int itemId);

	List<Object> deleteComment(UUID reviewId);

	String deleteAllReviews();

	List<ItemReview> getAllReviews();

	List<String> getAllimages(int itemId) throws ItemNotFoundException;
	
	List<ItemReviewDto> getReviewsOfUser(UUID userId, int itemId);
}
