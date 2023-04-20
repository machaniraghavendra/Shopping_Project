package com.shopping.query.command.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.exceptions.UserAlreadyExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.repos.UserRepo;
import com.shopping.query.command.service.UserService;


@Service
public class UserServiceImpl implements UserService{

	@Autowired
	private UserRepo userRepo;

	@Override
	public String save(UserEntity userEntity) throws UserAlreadyExistsException{
		userEntity.setUserEmail(userEntity.getUserEmail().toLowerCase());
		try {
			if(userRepo.existsById(userEntity.getUserName())||userRepo.existsById(userEntity.getUserEmail()))
			{
				throw new UserAlreadyExistsException("You have already created account with us by Username "+userEntity.getUserName()+" go to login and enjoy shopping with us !" );
			}
			else {
				userRepo.save(userEntity);
				return "You are signed-up with email "+userEntity.getUserName();
			}
		} catch (UserAlreadyExistsException e) {
			e.printStackTrace();
		}
		return "You have already created account with us by Username "+userEntity.getUserName()+" go to login and enjoy shopping with us !";
	}

	@Override
	public UserEntity find(String userEmail) throws UserNotFoundException {
		userEmail=userEmail.toLowerCase();
		try {
			if(userRepo.existsById(userEmail))
			{
				return userRepo.findById(userEmail).get();
			}
			else {
				throw new UserNotFoundException("The user "+userEmail+" does not exists");
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<UserEntity> findall() {
		return userRepo.findAll();
	}

	@Override
	public String delete(String userEmail) throws UserNotFoundException{
		userEmail=userEmail.toLowerCase();
		try {
			if (!userRepo.existsById(userEmail)) {
				throw new UserNotFoundException("The user "+userEmail+" does not exists");
			}else {
				userRepo.deleteById(userEmail);
				return "The profile has been deleted with email "+userEmail; 
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return "The profile with "+userEmail+" does not exists";
	}

	@Override
	public String update(UserEntity userEntity)  throws UserNotFoundException{
		userEntity.setUserEmail(userEntity.getUserEmail().toLowerCase());
		try {
			if(!(userRepo.existsById(userEntity.getUserName())||userRepo.existsById(userEntity.getUserEmail())))
			{
				throw new UserNotFoundException("The user "+userEntity.getUserEmail()+" does not exists");
			}
			else {
				userRepo.save(userEntity);
				return "You are profile has been updated with "+userEntity.getUserName();
			}
		} catch (UserNotFoundException e) {
			e.printStackTrace();
		}
		return "The user with email  "+userEntity.getUserEmail()+" does not exists";
	}

	@Override
	public boolean check(String userEmail, String Password) {
		userEmail=userEmail.toLowerCase();
		UserEntity user=new UserEntity();
		if(userRepo.existsById(userEmail))
		{
			user=userRepo.findById(userEmail).get();
			if(user.getUserPassword().equals(Password)) {
				return true;
			}
		}
		return false;
	}
}
