package com.shopping.query.command.service.implementation;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserAlreadyExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.repos.UserRepo;
import com.shopping.query.command.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Override
	public String save(UserEntity userEntity) throws UserAlreadyExistsException {
		userEntity.setUserEmail(userEntity.getUserEmail().toLowerCase());
		try {
			if (userRepo.existsById(userEntity.getUserName()) || userRepo.existsById(userEntity.getUserEmail())) {
				throw new UserAlreadyExistsException("You have already created account with us by Username "
						+ userEntity.getUserName() + " go to login and enjoy shopping with us !");
			} else {
				userEntity.setUserId(UUID.randomUUID());
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
		userEmail = userEmail.toLowerCase();
		try {
			if (userRepo.existsById(userEmail)) {
				UserDetailDto detailDto = mappingToUserDetailDto(userRepo.findById(userEmail).get());
				return detailDto;
			} else {
				throw new UserNotFoundException("The user " + userEmail + " does not exists");
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public UserDetailDto getUserWithId(UUID userId) throws UserNotFoundException {
		if (Objects.nonNull(userId)) {
			return mappingToUserDetailDto(findall().stream().filter(user -> user.getUserId().equals(userId)).findFirst()
					.orElseThrow(() -> new UserNotFoundException("No user Found")));
		}
		return null;
	}

	@Override
	public List<UserEntity> findall() {
		return userRepo.findAll();
	}

	@Override
	public String delete(String userEmail) throws UserNotFoundException {
		try {
			if (!userRepo.existsById(userEmail)) {
				throw new UserNotFoundException("The user " + userEmail + " does not exists");
			} else {
				userRepo.deleteById(userEmail);
				return "The profile has been deleted with email " + userEmail;
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return "The profile with " + userEmail + " does not exists";
	}

	@Override
	public String update(UserEntity userEntity) throws UserNotFoundException {
		userEntity.setUserEmail(userEntity.getUserEmail().toLowerCase());
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
	public boolean check(String userEmail, String Password) {
		userEmail = userEmail.toLowerCase();
		UserEntity user = new UserEntity();
		if (userRepo.existsById(userEmail)) {
			user = userRepo.findById(userEmail).get();
			if (user.getUserPassword().equals(Password)) {
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
		detailDto.setUserEmail(entity.getUserEmail());
		detailDto.setUserId(entity.getUserId());
		detailDto.setUserName(entity.getUserName());
		detailDto.setMobileNumber(entity.getMobileNumber());
		detailDto.setProfileImgUrl(entity.getProfileImgUrl());
		detailDto.setAdmin(entity.isAdmin());
		return detailDto;
	}

	private UserEntity getUserEntity(UUID userId) throws UserNotFoundException {
		return findall().stream().filter(a -> a.getUserId().equals(userId)).findFirst()
				.orElseThrow(() -> new UserNotFoundException("Not present"));
	}

}
