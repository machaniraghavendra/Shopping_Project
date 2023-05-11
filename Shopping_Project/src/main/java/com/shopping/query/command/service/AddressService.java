package com.shopping.query.command.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface AddressService {

	List<Object> saveAddress(AddressEntity addressEntity);

	List<Object> updateAddress(AddressEntity addressEntity);

	List<Object> deleteAddress(Integer id);

	AddressDto findAddress(Integer id) throws UserNotFoundException;

	AddressDto findAddressWithUserId(String userId, String address);

	String deleteAddressWithUserIdAndAddress(String userId, String address);
	
	List<AddressEntity> viewAllAddress();

	List<AddressDto> viewAllAddressWithUserId(String userId);

	List<Object> findAddressEntity(Integer id);
	
	Optional<AddressEntity> getAddressWithUserIdandAddress(String userId, String address);

	Optional<AddressEntity> findWIthReferenceId(UUID referenceId);
}
