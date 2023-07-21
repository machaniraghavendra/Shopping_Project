package com.shopping.query.command.service.implementation;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.shopping.query.command.entites.ItemReview;
import com.shopping.query.command.entites.ReviewImages;
import com.shopping.query.command.entites.dto.ItemReviewDto;
import com.shopping.query.command.entites.dto.RatingDto;
import com.shopping.query.command.entites.dto.ReviewImageDto;
import com.shopping.query.command.entites.dto.ReviewsCombinedDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemReviewNotExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.ReviewImageNotExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.ItemReviewRepo;
import com.shopping.query.command.repos.ReviewImagesRepo;
import com.shopping.query.command.service.ItemReviewService;
import com.shopping.query.command.service.RatingsService;
import com.shopping.query.command.service.ReviewImagesService;

@Service
public class ItemReviewServiceImpl implements ItemReviewService, ReviewImagesService {

	@Autowired
	private ItemReviewRepo reviewRepo;

	@Autowired
	private ReviewImagesRepo imagesRepo;

	private OrdersServImpl orderService = new OrdersServImpl();

	@Autowired
	private GlobalExceptionHandler exceptionHandler;

	@Autowired
	private MappersClass mappersClass;

	@Autowired
	private RatingsService ratingsService;

	private List<Object> returnList = new ArrayList<>();

	private final String NOT_SAVED_MSGE = "Not saved";

	@Override
	public String addComment(ReviewsCombinedDto combinedDto) throws ItemNotFoundException, UserNotFoundException {
		if (Objects.isNull(combinedDto)) {
			return NOT_SAVED_MSGE;
		}
		ItemReview itemReview = combinedDto.getItemReview();
		List<ReviewImages> images = new ArrayList<>();
		combinedDto.getImageUrls().forEach(
				image -> images.add(ReviewImages.builder().imageUrl(image).itemId(itemReview.getItemId()).build()));
		itemReview.setCommentAddedOn(orderService.getDate(LocalDateTime.now()));
		itemReview.setCommentAddedAt(orderService.getTime(LocalDateTime.now()));
		if (Objects.nonNull(mappersClass.itemDtoMapperById(itemReview.getItemId()))
				&& Objects.nonNull(mappersClass.userDetailDtoMapper(itemReview.getUserId()).getUserId())) {
			if (Objects.nonNull(itemReview.getReviewId()) && !reviewRepo.existsById(itemReview.getReviewId())) {
				return saveReview(itemReview, images);
			} else {
				itemReview.setReviewId(UUID.randomUUID());
				return saveReview(itemReview, images);
			}
		}
		return NOT_SAVED_MSGE;
	}

	private String saveReview(ItemReview itemReview, List<ReviewImages> images) {
		ItemReview savedItemReview = reviewRepo.save(itemReview);
		images.forEach(image -> image.setReviewId(savedItemReview.getReviewId()));
		saveAllImages(images);
		return "Added comment";
	}

	@Override
	public String saveAllImages(List<ReviewImages> reviewImages) {
		if (!reviewImages.isEmpty()) {
			reviewImages.forEach(this::saveImage);
			return "Saved list of images";
		}
		return NOT_SAVED_MSGE;
	}

	@SuppressWarnings("deprecation")
	@Override
	public String saveImage(ReviewImages reviewImage) {
		if (Objects.isNull(reviewImage)) {
			return NOT_SAVED_MSGE;
		} else {
			if (Objects.nonNull(reviewImage.getImageUrl()) || !StringUtils.isEmpty(reviewImage.getImageUrl())) {
				if (Objects.nonNull(reviewImage.getImageId()) && !imagesRepo.existsById(reviewImage.getImageId())) {
					imagesRepo.save(reviewImage);
				} else {
					reviewImage.setImageId(UUID.randomUUID());
					imagesRepo.save(reviewImage);
				}
				return "Saved Image";
			}
		}
		return NOT_SAVED_MSGE;
	}

	@Override
	public List<Object> updateComment(ItemReview itemReview) {
//		returnList = new ArrayList<>();
//		if (Objects.isNull(itemReview)) {
//			return returnList;
//		} else {
//			if (Objects.nonNull(itemReview.getReviewId()) && repo.existsById(itemReview.getReviewId())) {
//				repo.save(itemReview);
//				return returnList;
//			}
//			returnList.add("Updated comment to the item");
//		}
		return returnList;
//
	}

	@Override
	public ItemReview getReview(UUID reviewId) throws ItemReviewNotExistsException {
		try {
			if (reviewRepo.existsById(reviewId)) {
				return reviewRepo.findById(reviewId).get();
			} else {
				throw new ItemReviewNotExistsException("There is no comment with this id");
			}
		} catch (ItemReviewNotExistsException e) {
			exceptionHandler.itemReviewNotExistsException(e);
		}
		return null;
	}

	@Override
	public ItemReviewDto getReviewDto(UUID reviewId) throws ItemReviewNotExistsException, UserNotFoundException,
			ItemNotFoundException, RatingsOfUserNotFoundException {
		if (Objects.nonNull(reviewId)) {
			ItemReview itemReview = getReview(reviewId);
			if (Objects.nonNull(itemReview)) {
				return mapItemReviewEntityWithDto(itemReview);
			}
		}
		return null;
	}

	@Override
	public List<ItemReviewDto> getReviewsOfItem(int itemId) {
		List<ItemReviewDto> reviewDtos = new ArrayList<>();
		if (itemId > 0 && (reviewRepo.count() != 0)) {
			List<ItemReview> itemReviews = getAllReviews().stream().filter(review -> (review.getItemId() == itemId))
					.sorted(Comparator.comparing(ItemReview::getCommentAddedOn, Comparator.reverseOrder()))
					.collect(Collectors.toList());
			itemReviews.forEach(review -> {
				try {
					reviewDtos.add(mapItemReviewEntityWithDto(review));
				} catch (UserNotFoundException e) {
					exceptionHandler.usernotfoundexception(e);
				} catch (ItemNotFoundException e) {
					exceptionHandler.itemNotFoundException(e);
				} catch (ItemReviewNotExistsException e) {
					exceptionHandler.itemReviewNotExistsException(e);
				} catch (RatingsOfUserNotFoundException e) {
					exceptionHandler.ratingsOfUserNotFoundException(e);
				}
			});
		}
		return reviewDtos;
	}

	@Override
	public List<Object> deleteComment(UUID reviewId) {
		returnList = new ArrayList<>();
		try {
			if (Objects.nonNull(reviewId) && reviewRepo.existsById(reviewId)) {
				reviewRepo.deleteById(reviewId);
				deleteImage(reviewId);
				returnList.add("Comment deleted");
			} else {
				throw new ItemReviewNotExistsException("There is no comment with this Id");
			}
		} catch (ItemReviewNotExistsException e) {
			returnList.add(exceptionHandler.itemReviewNotExistsException(e));
		}
		return returnList;
	}

	@Override
	public String deleteAllReviews() {
		reviewRepo.deleteAll();
		deleteAllImages();
		return "Deleted all reviews";
	}

	@Override
	public List<ItemReview> getAllReviews() {
		return reviewRepo.findAll();
	}

	@Override
	public List<ItemReviewDto> getReviewsOfUser(UUID userId, int itemId) {
		List<ItemReviewDto> userCommentsOnItem = new ArrayList<>();
		if (Objects.nonNull(userId) && itemId > 0) {
			List<ItemReview> itemReviews = getAllReviews().stream()
					.filter(review -> (review.getItemId() == itemId && review.getUserId().equals(userId)))
					.sorted(Comparator.comparing(ItemReview::getCommentAddedOn, Comparator.reverseOrder()))
					.collect(Collectors.toList());
			itemReviews.forEach(review -> {
				try {
					userCommentsOnItem.add(mapItemReviewEntityWithDto(review));
				} catch (UserNotFoundException e) {
					exceptionHandler.usernotfoundexception(e);
				} catch (ItemNotFoundException e) {
					exceptionHandler.itemNotFoundException(e);
				} catch (ItemReviewNotExistsException e) {
					exceptionHandler.itemReviewNotExistsException(e);
				} catch (RatingsOfUserNotFoundException e) {
					exceptionHandler.ratingsOfUserNotFoundException(e);
				}
			});
		}
		return userCommentsOnItem;
	}

//	Images Service

	@Override
	public List<ReviewImageDto> getAllImagesWithItemAndReviewId(UUID reviewId, int itemId) throws ItemNotFoundException,
			ItemReviewNotExistsException, UserNotFoundException, RatingsOfUserNotFoundException {
		if (Objects.nonNull(reviewId) && itemId > 0 && Objects.nonNull(mappersClass.itemDtoMapperById(itemId))
				&& Objects.nonNull(mapItemReviewEntityWithDto(reviewId))) {
			List<ReviewImages> reviewImages = getAllImages().stream()
					.filter(image -> image.getItemId() == itemId && image.getReviewId().equals(reviewId))
					.collect(Collectors.toList());
			List<ReviewImageDto> reviewImageDtos = new ArrayList<>();
			reviewImages.forEach(image -> reviewImageDtos.add(mapReviewImageEntityWithDto(image)));
			return reviewImageDtos;
		}
		return Collections.emptyList();
	}

	public ReviewImages getReviewImage(UUID imageId) {
		try {
			if (Objects.nonNull(imageId) && imagesRepo.existsById(imageId)) {
				return imagesRepo.findById(imageId).get();
			} else {
				throw new ReviewImageNotExistsException("There is no image with this id");
			}
		} catch (ReviewImageNotExistsException e) {
			exceptionHandler.reviewImageNotExistsException(e);
		}
		return null;
	}

	@Override
	public List<ReviewImages> getAllImages() {
		return imagesRepo.findAll();
	}

	@Override
	public String deleteAllImages() {
		imagesRepo.deleteAll();
		return "Deleted all images";
	}

	@Override
	public List<Object> deleteImage(UUID reviewId) {
		returnList = new ArrayList<>();
		try {
			if (Objects.nonNull(reviewId)) {
				List<ReviewImages> imagesToDelete = getAllImages().stream()
						.filter(image -> image.getReviewId().equals(reviewId)).collect(Collectors.toList());
				imagesRepo.deleteAll(imagesToDelete);
				returnList.add("Deleted");
			} else {
				throw new ReviewImageNotExistsException("There is no image with this id");
			}
		} catch (ReviewImageNotExistsException e) {
			returnList.add(exceptionHandler.reviewImageNotExistsException(e));
		}
		return returnList;
	}

	public ItemReviewDto mapItemReviewEntityWithDto(UUID reviewId) throws UserNotFoundException,
			ItemReviewNotExistsException, RatingsOfUserNotFoundException, ItemNotFoundException {
		if (Objects.isNull(reviewId)) {
			return null;
		}
		ItemReview review = getReview(reviewId);
		return ItemReviewDto.builder().itemId(review.getItemId())
				.user(mappersClass.userDetailDtoMapper(review.getUserId())).commentAddedOn(review.getCommentAddedOn())
				.commentAddedAt(review.getCommentAddedAt()).comment(review.getComment())
				.commentTitle(review.getCommentTitle())
				.rating(Objects
						.isNull(ratingsService.getRatingWithuserIdAndItemId(review.getUserId(), review.getItemId()))
								? RatingDto.builder().itemId(review.getItemId()).userId(review.getUserId()).rating(0)
										.build()
								: ratingsService.getRatingWithuserIdAndItemId(review.getUserId(), review.getItemId()))
				.build();
	}

	public ItemReviewDto mapItemReviewEntityWithDto(ItemReview review) throws UserNotFoundException,
			ItemNotFoundException, ItemReviewNotExistsException, RatingsOfUserNotFoundException {
		if (Objects.isNull(review)) {
			return null;
		}
		return ItemReviewDto.builder().itemId(review.getItemId())
				.user(mappersClass.userDetailDtoMapper(review.getUserId())).commentAddedOn(review.getCommentAddedOn())
				.commentAddedAt(review.getCommentAddedAt()).comment(review.getComment())
				.commentTitle(review.getCommentTitle())
				.imageDto(getAllImagesWithItemAndReviewId(review.getReviewId(), review.getItemId()))
				.rating(Objects
						.isNull(ratingsService.getRatingWithuserIdAndItemId(review.getUserId(), review.getItemId()))
								? RatingDto.builder().itemId(review.getItemId()).userId(review.getUserId()).rating(0)
										.build()
								: ratingsService.getRatingWithuserIdAndItemId(review.getUserId(), review.getItemId()))
				.build();
	}

	public ReviewImageDto mapReviewImageEntityWithDtoWithId(UUID imageId) {
		if (Objects.isNull(imageId)) {
			return null;
		}
		ReviewImages reviewImages = getReviewImage(imageId);
		return ReviewImageDto.builder().imageUrl(reviewImages.getImageUrl()).itemId(reviewImages.getItemId())
				.reviewId(reviewImages.getReviewId()).build();
	}

	public ReviewImageDto mapReviewImageEntityWithDto(ReviewImages reviewImages) {
		if (Objects.isNull(reviewImages)) {
			return null;
		}
		return ReviewImageDto.builder().imageUrl(reviewImages.getImageUrl()).itemId(reviewImages.getItemId())
				.reviewId(reviewImages.getReviewId()).build();
	}

//	public String timePeriodCalculator(LocalDate dateOn) {
//		String period = null;
//		long days = ChronoUnit.DAYS.between(dateOn, LocalDate.now());
//		switch ((int) (days / 30)) {
//		case 1: {
//			period = "1 month ago";
//		}
//		case 2: {
//			period = "2 months ago";
//		}
//		case 3: {
//			period = "3 months ago";
//		}
//		case 4: {
//			period = "4 months ago";
//		}
//		case 5: {
//			period = "5 months ago";
//		}
//		case 6: {
//			period = "6 months ago";
//		}
//		case 7: {
//			period = "7 months ago";
//		}
//		case 8: {
//			period = "8 months ago";
//		}
//		case 9: {
//			period = "9 months ago";
//		}
//		case 10: {
//			period = "10 months ago";
//		}
//		case 11: {
//			period = "11 months ago";
//		}
//		case 12: {
//			period = "12 months ago";
//		}
//		default:
//			period = "Below one month";
//
//			return period;
//		}
//	}
}
