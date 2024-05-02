package com.shopping.query.command.service.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import com.shopping.query.command.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.shopping.query.command.entites.ItemReview;
import com.shopping.query.command.entites.RatingsOfUser;
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
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.ItemReviewRepo;
import com.shopping.query.command.repos.ReviewImagesRepo;
import com.shopping.query.command.service.ItemReviewService;
import com.shopping.query.command.service.RatingsService;
import com.shopping.query.command.service.ReviewImagesService;

import static com.shopping.query.command.configuration.Constants.ORDER;
import static com.shopping.query.command.configuration.Constants.REVIEW;

@Service
public class ItemReviewServiceImpl implements ItemReviewService, ReviewImagesService {

     @Autowired
     private ItemReviewRepo reviewRepo;

     @Autowired
     private ReviewImagesRepo imagesRepo;

     private final OrdersServImpl orderService = new OrdersServImpl();

     @Autowired
     private GlobalExceptionHandler exceptionHandler;

     @Autowired
     private MappersClass mappersClass;

     @Autowired
     private RatingsService ratingsService;

     @Autowired
     private ItemService itemService;

     private List<Object> returnList = new ArrayList<>();

     private final String NOT_SAVED_MSGE = "Not saved";

     @Override
     public String addComment(ReviewsCombinedDto combinedDto) throws ItemNotFoundException, UserException {
          if (Objects.isNull(combinedDto)) {
               return NOT_SAVED_MSGE;
          }
          ItemReview itemReview = combinedDto.getItemReview();
          List<ReviewImages> images = new ArrayList<>();
          combinedDto.getImageUrls().forEach(
               image -> images.add(ReviewImages.builder().imageUrl(image).itemId(itemReview.getItemId()).build()));
          itemReview.setCommentAddedOn(orderService.getDate(LocalDateTime.now()));
          itemReview.setCommentAddedAt(orderService.getTime(LocalDateTime.now()));
          if (Objects.nonNull(mappersClass.getItemDtoById(itemReview.getItemId()))
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
          itemService.updateItemData(itemReview.getItemId(), 1, REVIEW);
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
               if (!StringUtils.isEmpty(reviewImage.getImageUrl()) || Objects.nonNull(reviewImage.getImageUrl())) {
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
//				repo.addItem(itemReview);
//				return returnList;
//			}
//			returnList.add("Updated comment to the item");
//		}
          return returnList;
//
     }

     @Override
     public ItemReview getReview(UUID reviewId) throws ItemReviewNotExistsException {
          return reviewRepo.findById(reviewId).orElseThrow(() -> new ItemReviewNotExistsException("There is no comment with this id"));
     }

     @Override
     public ItemReviewDto getReviewDto(UUID reviewId) throws ItemReviewNotExistsException, UserException,
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
                    .sorted(Comparator.comparing(ItemReview::getCommentAddedOn)).toList();
               itemReviews.forEach(review -> {
                    try {
                         reviewDtos.add(mapItemReviewEntityWithDto(review));
                    } catch (UserException e) {
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
                    var review = getReview(reviewId);
                    reviewRepo.deleteById(reviewId);
                    deleteImage(reviewId);
                    itemService.updateItemData(review.getItemId(), -1, REVIEW);
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
                    .sorted(Comparator.comparing(ItemReview::getCommentAddedOn, Comparator.reverseOrder())).toList();
               itemReviews.forEach(review -> {
                    try {
                         userCommentsOnItem.add(mapItemReviewEntityWithDto(review));
                    } catch (UserException e) {
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
          ItemReviewNotExistsException, UserException, RatingsOfUserNotFoundException {
          if (Objects.nonNull(reviewId) && itemId > 0 && Objects.nonNull(mappersClass.getItemDtoById(itemId))
               && Objects.nonNull(mapItemReviewEntityWithDto(reviewId))) {
               List<ReviewImages> reviewImages = getAllImages().stream()
                    .filter(image -> image.getItemId() == itemId && image.getReviewId().equals(reviewId)).toList();
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

     @Override
     public List<String> getAllimages(int itemId) throws ItemNotFoundException {
          if (imagesRepo.findAll().isEmpty() && mappersClass.getItemDtoById(itemId).getItemName().isEmpty())
               return Collections.emptyList();
          return getAllImages().stream().filter(image -> Objects.equals(image.getItemId(), itemId))
               .map(ReviewImages::getImageUrl).toList();
     }

     public ItemReviewDto mapItemReviewEntityWithDto(UUID reviewId) throws UserException,
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

     public ItemReviewDto mapItemReviewEntityWithDto(ItemReview review) throws UserException,
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

     public void deleteAllReviewOfUser(UUID userId) throws RatingsOfUserNotFoundException, UserException {
          try {
               List<ItemReview> itemReviews = getAllReviews().stream().filter(a -> Objects.equals(a.getUserId(), userId))
                    .toList();
               List<ReviewImages> images = getAllImages();
               List<ReviewImages> imagesToDelete = new ArrayList<>();
               List<RatingsOfUser> ratingsOfUsers = ratingsService.getAllRatings().stream()
                    .filter(a -> a.getUserId().equals(userId)).toList();
               for (ItemReview itemReview : itemReviews) {
                    imagesToDelete
                         .addAll(images.stream().filter(a -> a.getReviewId().equals(itemReview.getReviewId())).toList());
               }
               reviewRepo.deleteAll(itemReviews);
               imagesRepo.deleteAll(imagesToDelete);
               for (RatingsOfUser ratingOfUser : ratingsOfUsers) {
                    ratingsService.delete(userId, ratingOfUser.getItemId());
               }

          } catch (Exception e) {
               throw new UserException(e.getMessage());
          }
     }

}
