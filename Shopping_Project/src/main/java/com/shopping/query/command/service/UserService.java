package com.shopping.query.command.service;

import java.util.List;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.exceptions.UserAlreadyExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface UserService {

	String save(UserEntity userEntity) throws UserAlreadyExistsException;

	UserEntity find(String userEmail) throws UserNotFoundException;

	List<UserEntity> findall();

	String delete(String userEmail) throws UserNotFoundException;

	String update(UserEntity userEntity) throws UserNotFoundException;

	boolean check(String userEmail, String Password);
}
