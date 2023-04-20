package com.shopping.query.command.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.FavouritesEntity;
import com.shopping.query.command.exceptions.ItemAlreadyInFavException;
import com.shopping.query.command.exceptions.ItemNotFoundInFavException;
import com.shopping.query.command.service.implementation.FavServiceImpl;

@RestController
@RequestMapping("/fav")
@CrossOrigin(origins = "*")
public class FavController {

	@Autowired
	FavServiceImpl favServiceImpl;
	
	@PostMapping("/")
	public ResponseEntity<String> save(@RequestBody FavouritesEntity favEntity) throws ItemAlreadyInFavException{
		return new ResponseEntity<String>(favServiceImpl.save(favEntity),HttpStatus.OK);
	}
	
	@PutMapping("/")
	public ResponseEntity<String> update(@RequestBody FavouritesEntity favEntity) throws ItemNotFoundInFavException{
		return new ResponseEntity<String>(favServiceImpl.update(favEntity),HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> delete(@PathVariable("id") int favId) throws ItemNotFoundInFavException{
		return new ResponseEntity<String>(favServiceImpl.delete(favId),HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<FavouritesEntity> find(@PathVariable("id") int favId) throws ItemNotFoundInFavException{
		return new ResponseEntity<FavouritesEntity>(favServiceImpl.find(favId),HttpStatus.OK);
	}
	
	@GetMapping("/")
	public ResponseEntity<List<FavouritesEntity>> viewall(){
		return new ResponseEntity<List<FavouritesEntity>>(favServiceImpl.viewall(),HttpStatus.OK);
	}
	
//	@GetMapping("/total")
//	public String total() {
//		return favServiceImpl.total();
//	}
}
