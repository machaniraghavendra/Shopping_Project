package com.shopping.query.command.service;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.RatingsOfUser;
import com.shopping.query.command.entites.dto.RatingDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.RatingsOfUserAlreadyExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface RatingsService {

	Object saveRating(RatingsOfUser ratings) throws RatingsOfUserAlreadyExistsException, RatingsOfUserNotFoundException,
			UserNotFoundException, ItemNotFoundException;

	Object updateRating(RatingsOfUser ratings) throws RatingsOfUserNotFoundException;

	String delete(UUID userId, int itemId)
			throws RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException;

	RatingsOfUser getRatingWithRatingId(UUID ratingId) throws RatingsOfUserNotFoundException;

	RatingsOfUser getRatingOfUserWithuserIdAndItemId(UUID userId, int itemId)
			throws RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException;;

	RatingDto getRatingWithuserIdAndItemId(UUID userId, int ItemId)
			throws RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException;
	
	List<Object> getRatingWithuserId(UUID userId)
			throws RatingsOfUserNotFoundException, UserNotFoundException;

	List<RatingsOfUser> getAllRatings();

	String deleteAllratings();
}
