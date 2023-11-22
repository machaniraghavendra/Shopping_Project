package com.shopping.query.command.service;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.ReviewImages;
import com.shopping.query.command.entites.dto.ReviewImageDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemReviewNotExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserException;

public interface ReviewImagesService {
	
	String saveImage(ReviewImages reviewImage);

	String saveAllImages(List<ReviewImages> reviewImages);
	
	List<ReviewImageDto> getAllImagesWithItemAndReviewId(UUID reviewId, int itemId) throws ItemNotFoundException, ItemReviewNotExistsException, UserException, RatingsOfUserNotFoundException;
	
	List<ReviewImages> getAllImages();
		
	String deleteAllImages();
	
	List<Object> deleteImage(UUID imageid);
	
}
