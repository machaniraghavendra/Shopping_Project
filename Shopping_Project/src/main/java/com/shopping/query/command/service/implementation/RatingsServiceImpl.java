package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.RatingsOfUser;
import com.shopping.query.command.entites.dto.RatingDto;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.RatingsOfUserAlreadyExistsException;
import com.shopping.query.command.exceptions.RatingsOfUserNotFoundException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.RatingsOfUserRepo;
import com.shopping.query.command.service.ItemService;
import com.shopping.query.command.service.RatingsService;
import com.shopping.query.command.service.UserService;

@Service
public class RatingsServiceImpl implements RatingsService {

	@Autowired
	private RatingsOfUserRepo repo;

	@Autowired
	private UserService userService;

	@Autowired
	private ItemService itemService;

	@Autowired
	private GlobalExceptionHandler exceptionHandler;

	private MappersClass mappersClass = new MappersClass();

	private List<Object> returnList = new ArrayList<>();

	@Override
	public Object saveRating(RatingsOfUser ratings) throws RatingsOfUserAlreadyExistsException,
			RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException {
		returnList = new ArrayList<>();
		if (Objects.nonNull(ratings.getUserId())) {
			RatingsOfUser ratingsOfUser = getRatingOfUserWithuserIdAndItemId(ratings.getUserId(), ratings.getItemId());
			if (Objects.isNull(ratingsOfUser)) {
				ratings.setRatingId(UUID.randomUUID());
				try {
					UserDetailDto userDto = userService.getUserWithId(ratings.getUserId());
					ItemEntity item = (ItemEntity) itemService.find(ratings.getItemId()).get(0);
					if (Objects.nonNull(userDto) && Objects.nonNull(item)) {
						repo.save(ratings);
						updateRatingOfItem(ratings.getItemId());
						returnList.clear();
						returnList.add("Rating added to item " + item.getItemName());
					}
				} catch (Exception e) {
					returnList.clear();
					if (e instanceof RatingsOfUserNotFoundException) {
						returnList.add(exceptionHandler
								.ratingsOfUserNotFoundException(new RatingsOfUserNotFoundException(e.getMessage())));
					} else if (e instanceof UserNotFoundException) {
						returnList
								.add(exceptionHandler.usernotfoundexception(new UserNotFoundException(e.getMessage())));
					} else if (e instanceof ItemNotFoundException) {
						returnList
								.add(exceptionHandler.itemNotFoundException(new ItemNotFoundException(e.getMessage())));
					} else {
						returnList.add(exceptionHandler.globalException(e));
					}
				}
			} else {
				ratings.setRatingId(ratingsOfUser.getRatingId());
				return updateRating(ratings);
			}
		}
		return returnList.get(0);
	}

	@Override
	public Object updateRating(RatingsOfUser ratings) throws RatingsOfUserNotFoundException {
		returnList = new ArrayList<>();
		if (Objects.nonNull(ratings.getUserId())) {
			try {
				if (repo.existsById(ratings.getRatingId())) {
					UserDetailDto userDto = userService.getUserWithId(ratings.getUserId());
					ItemEntity item = (ItemEntity) itemService.find(ratings.getItemId()).get(0);
					if (Objects.nonNull(userDto) && Objects.nonNull(item)) {
						RatingsOfUser ratingsOfUser = (RatingsOfUser) getRatingOfUserWithuserIdAndItemId(
								ratings.getUserId(), ratings.getItemId());
						returnList.clear();
						if (Objects.nonNull(ratingsOfUser)) {
							repo.save(ratings);
							updateRatingOfItem(ratings.getItemId());
							returnList.add("Rating added to item " + item.getItemName());
						} else {
							returnList.add("Not added");
						}
					}
				}
			} catch (Exception e) {
				returnList.clear();
				if (e instanceof RatingsOfUserNotFoundException) {
					returnList.add(exceptionHandler
							.ratingsOfUserNotFoundException(new RatingsOfUserNotFoundException(e.getMessage())));
				} else if (e instanceof UserNotFoundException) {
					returnList.add(exceptionHandler.usernotfoundexception(new UserNotFoundException(e.getMessage())));
				} else if (e instanceof ItemNotFoundException) {
					returnList.add(exceptionHandler.itemNotFoundException(new ItemNotFoundException(e.getMessage())));
				} else {
					returnList.add(exceptionHandler.globalException(e));
				}
			}
		}
		return returnList.get(0);
	}

	private void updateRatingOfItem(int itemId) throws ItemNotFoundException {
		List<Integer> ratingsOfItems = getAllRatings().stream().filter(rating -> rating.getItemId() == itemId)
				.map(rating -> rating.getRating()).collect(Collectors.toList());

		float totalAmount_Of_Ratings = 0, totalAmountOf1starRating = 0, totalAmountOf2starRating = 0,
				totalAmountOf3starRating = 0, totalAmountOf4starRating = 0, totalAmountOf5starRating = 0;

		totalAmountOf1starRating = ratingsOfItems.stream().filter(rating -> rating == 1).collect(Collectors.toList())
				.size();
		totalAmountOf2starRating = ratingsOfItems.stream().filter(rating -> rating == 2).collect(Collectors.toList())
				.size();
		totalAmountOf3starRating = ratingsOfItems.stream().filter(rating -> rating == 3).collect(Collectors.toList())
				.size();
		totalAmountOf4starRating = ratingsOfItems.stream().filter(rating -> rating == 4).collect(Collectors.toList())
				.size();
		totalAmountOf5starRating = ratingsOfItems.stream().filter(rating -> rating == 5).collect(Collectors.toList())
				.size();

		ItemEntity itemEntity = (ItemEntity) itemService.find(itemId).get(0);

		totalAmount_Of_Ratings = (5 * totalAmountOf5starRating + 4 * totalAmountOf4starRating
				+ 3 * totalAmountOf3starRating + 2 * totalAmountOf2starRating + 1 * totalAmountOf1starRating)
				/ (totalAmountOf1starRating + totalAmountOf2starRating + totalAmountOf3starRating
						+ totalAmountOf4starRating + totalAmountOf5starRating);

		itemEntity.setRatingOfItem(totalAmount_Of_Ratings);
		itemService.updateItem(itemEntity);
	}

	@Override
	public String delete(UUID userId, int itemId)
			throws RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException {
		if (Objects.nonNull(userId) && itemId > 0) {
			try {
				UserDetailDto userDto = userService.getUserWithId(userId);
				ItemEntity item = (ItemEntity) itemService.find(itemId).get(0);
				if (Objects.nonNull(userDto) && Objects.nonNull(item)) {
					RatingsOfUser rating = getRatingOfUserWithuserIdAndItemId(userId, itemId);
					repo.delete(rating);
					return "Deleted rating of id " + rating.getRatingId();
				}
			} catch (Exception e) {
				if (e instanceof RatingsOfUserNotFoundException) {
					exceptionHandler.ratingsOfUserNotFoundException(new RatingsOfUserNotFoundException(e.getMessage()));
				} else if (e instanceof UserNotFoundException) {
					exceptionHandler.usernotfoundexception(new UserNotFoundException(e.getMessage()));
				} else if (e instanceof ItemNotFoundException) {
					exceptionHandler.itemNotFoundException(new ItemNotFoundException(e.getMessage()));
				} else {
					exceptionHandler.globalException(e);
				}
			}
		}
		return "Not deleted";
	}

	@Override
	public RatingsOfUser getRatingWithRatingId(UUID ratingId) throws RatingsOfUserNotFoundException {
		try {
			if (Objects.nonNull(ratingId) && repo.existsById(ratingId)) {
				return repo.findById(ratingId).get();
			} else {
				throw new RatingsOfUserNotFoundException("Rating with user this not found");
			}
		} catch (RatingsOfUserNotFoundException e) {
			exceptionHandler.ratingsOfUserNotFoundException(e);
		}
		return null;
	}

	@Override
	public RatingsOfUser getRatingOfUserWithuserIdAndItemId(UUID userId, int itemId)
			throws RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException {
		if (Objects.nonNull(userId) && itemId > 0) {
			try {
				UserDetailDto userDto = userService.getUserWithId(userId);
				ItemEntity item = (ItemEntity) itemService.find(itemId).get(0);
				if (Objects.nonNull(userDto) && Objects.nonNull(item)) {
					return getAllRatings().stream().filter(rating -> rating.getUserId().equals(userId))
							.filter(rating -> Integer.compare(rating.getItemId(), itemId) == 0)
							.collect(Collectors.toList()).get(0);
				}
			} catch (Exception e) {
				if (e instanceof RatingsOfUserNotFoundException) {
					exceptionHandler.ratingsOfUserNotFoundException(new RatingsOfUserNotFoundException(e.getMessage()));
				} else if (e instanceof UserNotFoundException) {
					exceptionHandler.usernotfoundexception(new UserNotFoundException(e.getMessage()));
				} else if (e instanceof ItemNotFoundException) {
					exceptionHandler.itemNotFoundException(new ItemNotFoundException(e.getMessage()));
				} else {
					exceptionHandler.globalException(e);
				}
			}
		}
		return null;
	}

	@Override
	public RatingDto getRatingWithuserIdAndItemId(UUID userId, int itemId)
			throws RatingsOfUserNotFoundException, UserNotFoundException, ItemNotFoundException {
		returnList = new ArrayList<>();
		if (Objects.nonNull(userId) && itemId > 0) {
			try {
				RatingsOfUser ratingsOfUser = getRatingOfUserWithuserIdAndItemId(userId, itemId);
				return mappersClass.mapRatingsOfUserWithdto(ratingsOfUser);
			} catch (Exception e) {
				if (e instanceof RatingsOfUserNotFoundException) {
					exceptionHandler.ratingsOfUserNotFoundException(new RatingsOfUserNotFoundException(e.getMessage()));
				} else if (e instanceof UserNotFoundException) {
					exceptionHandler.usernotfoundexception(new UserNotFoundException(e.getMessage()));
				} else if (e instanceof ItemNotFoundException) {
					exceptionHandler.itemNotFoundException(new ItemNotFoundException(e.getMessage()));
				} else {
					exceptionHandler.globalException(e);
				}
			}
		}
		return null;
	}

	@Override
	public List<Object> getRatingWithuserId(UUID userId) throws RatingsOfUserNotFoundException, UserNotFoundException {
		List<Object> ratingDto = new ArrayList<>();
		if (Objects.nonNull(userId)) {
			try {
				UserDetailDto userDto = userService.getUserWithId(userId);
				if (Objects.nonNull(userDto)) {
					getAllRatings().stream().filter(rating -> Objects.equals(rating.getUserId(), userId))
							.collect(Collectors.toList())
							.forEach(rating -> ratingDto.add(mappersClass.mapRatingsOfUserWithdto(rating)));
					if (!ratingDto.isEmpty()) {
						return ratingDto;
					} else {
						throw new RatingsOfUserNotFoundException("No ratings found for the user " + userId);
					}
				} else {
					throw new UserNotFoundException("No user with this Id" + userId);
				}
			} catch (Exception e) {
				ratingDto.clear();
				if (e instanceof RatingsOfUserNotFoundException) {
					ratingDto.add(exceptionHandler
							.ratingsOfUserNotFoundException(new RatingsOfUserNotFoundException(e.getMessage())));
				} else if (e instanceof UserNotFoundException) {
					ratingDto.add(exceptionHandler.usernotfoundexception(new UserNotFoundException(e.getMessage())));
				} else {
					ratingDto.add(exceptionHandler.globalException(e));
				}
			}
		}
		return ratingDto;
	}

	@Override
	public List<RatingsOfUser> getAllRatings() {
		return repo.findAll();
	}

	@Override
	public String deleteAllratings() {
		repo.deleteAll();
		return "Deleted all Ratings";
	}

}
