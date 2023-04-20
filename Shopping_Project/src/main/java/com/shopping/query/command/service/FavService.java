package com.shopping.query.command.service;

import java.util.List;

import com.shopping.query.command.entites.FavouritesEntity;
import com.shopping.query.command.exceptions.ItemAlreadyInFavException;
import com.shopping.query.command.exceptions.ItemNotFoundInFavException;

public interface FavService {

	String save(FavouritesEntity favouritesEntity) throws ItemAlreadyInFavException;

	String update(FavouritesEntity favouritesEntity) throws ItemNotFoundInFavException;

	String delete(int favId) throws ItemNotFoundInFavException;

	FavouritesEntity find(int favId) throws ItemNotFoundInFavException;

	List<FavouritesEntity> viewall();
}
