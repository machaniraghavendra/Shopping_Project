package com.shopping.query.command.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.shopping.query.command.entites.FavouritesEntity;
import com.shopping.query.command.entites.dto.FavouriteDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyInFavException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInFavException;
import com.shopping.query.command.exceptions.UserException;

public interface FavService {

	String save(FavouritesEntity favouritesEntity) throws ItemAlreadyInFavException, ItemNotFoundException;

	String update(FavouritesEntity favouritesEntity) throws ItemNotFoundInFavException, ItemNotFoundException;

	String delete(String itemName, UUID userId) throws ItemNotFoundInFavException, ItemNotFoundException;

	FavouriteDto find(int favId) throws ItemNotFoundInFavException, UserException, ItemNotFoundException;

	void deleteAllCartItemsOfUser(UUID userId) throws UserException;

	List<FavouritesEntity> viewall();
	
	List<Map<UUID, List<ItemsDto>>> viewallMap() throws UserException, ItemNotFoundException ;

	List<List<ItemsDto>> getListofFavItemswithUserId(UUID userId)
			throws UserException, ItemNotFoundException ;
}
