package com.shopping.query.command.service;

import java.util.List;
import java.util.Map;

import com.shopping.query.command.entites.FavouritesEntity;
import com.shopping.query.command.entites.dto.FavouriteDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyInFavException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInFavException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface FavService {

	String save(FavouritesEntity favouritesEntity) throws ItemAlreadyInFavException, ItemNotFoundException;

	String update(FavouritesEntity favouritesEntity) throws ItemNotFoundInFavException, ItemNotFoundException;

	String delete(int favId) throws ItemNotFoundInFavException, ItemNotFoundException;

	FavouriteDto find(int favId) throws ItemNotFoundInFavException, UserNotFoundException, ItemNotFoundException;

	List<FavouritesEntity> viewall();
	
	List<Map<String, List<ItemsDto>>> viewallMap() throws UserNotFoundException, ItemNotFoundException ;

}
