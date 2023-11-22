package com.shopping.query.command.service;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserException;

public interface UserService {

	String save(UserEntity userEntity) throws UserException;

	UserDetailDto find(String userEmail) throws UserException;
	
	UserDetailDto getUserWithId(UUID userId) throws UserException;

	List<UserEntity> findall();

	String delete(UUID userId) throws UserException;

	String update(UserEntity userEntity) throws UserException;

	boolean check(String userEmail, String Password) throws UserException;
	
	boolean checkIsAdmin(UUID userId) throws UserException;

    String sendOtpToUserEmail(String userEmail, String userName);

    String verifyOtpOfUser(String userEmail, String userName);
}
