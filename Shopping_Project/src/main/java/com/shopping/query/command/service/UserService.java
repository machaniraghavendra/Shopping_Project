package com.shopping.query.command.service;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserAlreadyExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface UserService {

	String save(UserEntity userEntity) throws UserAlreadyExistsException;

	UserDetailDto find(String userEmail) throws UserNotFoundException;
	
	UserDetailDto getUserWithId(UUID userId) throws UserNotFoundException;

	List<UserEntity> findall();

	String delete(UUID userId) throws UserNotFoundException;

	String update(UserEntity userEntity) throws UserNotFoundException;

	boolean check(String userEmail, String Password) throws UserNotFoundException;
	
	boolean checkIsAdmin(UUID userId) throws UserNotFoundException;
}
