package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserAlreadyExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.repos.UserRepo;
import com.shopping.query.command.service.AddressService;
import com.shopping.query.command.service.BotService;
import com.shopping.query.command.service.CartService;
import com.shopping.query.command.service.FavService;
import com.shopping.query.command.service.ItemReviewService;
import com.shopping.query.command.service.OrderService;
import com.shopping.query.command.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl extends SecurityServiceImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	@Lazy
	private CartService cartService;

	@Autowired
	@Lazy
	private FavService favService;

	@Autowired
	@Lazy
	private BotService botService;

	@Autowired
	@Lazy
	private OrderService orderService;

	@Autowired
	@Lazy
	private ItemReviewService itemReviewService;

	@Autowired
	@Lazy
	private AddressService addressService;

	@Override
	public String save(UserEntity userEntity) throws UserAlreadyExistsException {
		userEntity.setUserEmail(userEntity.getUserEmail().toLowerCase());
		try {
			if (userRepo.existsById(userEntity.getUserName()) || userRepo.existsById(userEntity.getUserEmail())) {
				throw new UserAlreadyExistsException("You have already created account with us by Username "
						+ userEntity.getUserName() + " go to login and enjoy shopping with us !");
			} else {
				userEntity.setUserId(UUID.randomUUID());
				userEntity.setUserEmail(encrypt(userEntity.getUserEmail()));
				userEntity.setUserPassword(encrypt(userEntity.getUserPassword()));
				userRepo.save(userEntity);
				return "You are signed-up with name " + userEntity.getUserName();
			}
		} catch (UserAlreadyExistsException e) {
			e.printStackTrace();
		}
		return "You have already created account with us by Username " + userEntity.getUserName()
				+ " go to login and enjoy shopping with us !";
	}

	@Override
	public UserDetailDto find(String userEmail) throws UserNotFoundException {
		userEmail = encrypt(userEmail);
		try {
			if (userRepo.existsById(userEmail)) {
				UserDetailDto detailDto = mappingToUserDetailDto(userRepo.findById(userEmail).get());
				return detailDto;
			} else {
				throw new UserNotFoundException("The user " + userEmail + " does not exists");
			}
		} catch (UserNotFoundException e) {
			log.error(e.getMessage());
		}
		return null;
	}

	@Override
	public UserDetailDto getUserWithId(UUID userId) throws UserNotFoundException {
		if (Objects.nonNull(userId)) {
			return mappingToUserDetailDto(findall().stream().filter(user -> Objects.equals(user.getUserId(), userId))
					.findFirst().orElseThrow(() -> new UserNotFoundException("No user Found")));
		}
		return null;
	}

	@Override
	public List<UserEntity> findall() {
		List<UserEntity> duplicateEntities = new ArrayList<>();
		userRepo.findAll().forEach(user -> {
			user.setMobileNumber("XXXXXX" + user.getMobileNumber().substring(user.getMobileNumber().length() - 4,
					user.getMobileNumber().length()));
			duplicateEntities.add(user);
		});
		return duplicateEntities;
	}

	@Override
	public String delete(UUID userId) throws UserNotFoundException {
		try {
			UserEntity user = getUserEntity(userId);
			if (!userRepo.existsById(user.getUserEmail())) {
				throw new UserNotFoundException("The user " + user.getUserEmail() + " does not exists");
			} else {
				log.info("Cart deleting of user {}", userId);
				cartService.deleteAllCartItemsOfUser(userId);
				log.info("Cart deletedof user {}", userId);
				log.info("fav deletingof user {}", userId);
				favService.deleteAllCartItemsOfUser(userId);
				log.info("fav deleted of user {}", userId);
				log.info("Bot deleting of user {}", userId);
				botService.listClear(userId);
				log.info("Orders deleting of user {}", userId);
				orderService.deleteAllOrdersofUser(userId);
				log.info("Review deleting of user {}", userId);
				itemReviewService.deleteAllReviews();
				log.info("Address deleting of user {}", userId);
				addressService.deleteAlladdressOfUser(userId);
				log.info("User data deleting of user {}", userId);
				userRepo.deleteById(user.getUserEmail());
				log.info("User deleted of user {}", userId);
				return "The profile has been deleted with email " + user.getUserEmail();
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return "The profile with " + userId + " does not exists";
	}

	@Override
	public String update(UserEntity userEntity) throws UserNotFoundException {
		userEntity.setUserEmail(Objects.isNull(decrypt(userEntity.getUserEmail())) ? encrypt(userEntity.getUserEmail())
				: userEntity.getUserEmail());
		try {
			if (!(userRepo.existsById(userEntity.getUserName()) || userRepo.existsById(userEntity.getUserEmail()))) {
				throw new UserNotFoundException("The user " + userEntity.getUserEmail() + " does not exists");
			} else {
				UserEntity presentUserEntity = getUserEntity(userEntity.getUserId());
				if (Objects.isNull(userEntity.getUserPassword())) {
					userEntity.setUserPassword(presentUserEntity.getUserPassword());
				}
				userRepo.save(userEntity);
				return "You are profile has been updated with " + userEntity.getUserName();
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return "The user with email  " + userEntity.getUserEmail() + " does not exists";
	}

	@Override
	public boolean check(String userEmail, String password) throws UserNotFoundException {
		userEmail = encrypt(userEmail);
		password = encrypt(password);
		UserEntity user = new UserEntity();
		if (userRepo.existsById(userEmail)) {
			user = userRepo.findById(userEmail).get();
			if (user.getUserPassword().equals(password)) {
				user.setLoggedIn(true);
				update(user);
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean checkIsAdmin(UUID userId) throws UserNotFoundException {
		if (Objects.nonNull(userId)) {
			return getUserEntity(userId).isAdmin();
		}
		return false;
	}

	private UserDetailDto mappingToUserDetailDto(UserEntity entity) {
		UserDetailDto detailDto = new UserDetailDto();
		detailDto.setUserEmail(decrypt(entity.getUserEmail()));
		detailDto.setUserId(entity.getUserId());
		detailDto.setUserName(entity.getUserName());
		detailDto.setMobileNumber(entity.getMobileNumber());
		detailDto.setProfileImgUrl(entity.getProfileImgUrl());
		detailDto.setLoggedIn(entity.isLoggedIn());
		detailDto.setAdmin(entity.isAdmin());
		detailDto.setTotalOrdersCountOfUser(getOrdersCountofUser(entity.getUserId()));
		return detailDto;
	}

	private int getOrdersCountofUser(UUID userId) {
		return orderService.getAllOrders().stream().filter(a -> a.getUserId().equals(userId))
				.collect(Collectors.toList()).size();
	}

	private UserEntity getUserEntity(UUID userId) throws UserNotFoundException {
		return findall().stream().filter(a -> a.getUserId().equals(userId)).findFirst()
				.orElseThrow(() -> new UserNotFoundException("Not present"));
	}

}
