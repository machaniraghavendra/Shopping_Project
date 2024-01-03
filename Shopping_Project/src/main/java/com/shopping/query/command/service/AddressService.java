package com.shopping.query.command.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.exceptions.UserException;

public interface AddressService {

	List<Object> saveAddress(AddressDto address);

	List<Object> updateAddress(AddressEntity addressEntity);

	List<Object> deleteAddress(Integer id);

	AddressDto findAddress(Integer id) throws UserException;

	AddressDto findAddressWithUserId(UUID userId, UUID addressUuid);

	String deleteAddressWithReferenceId(UUID referenceId);

	List<AddressEntity> viewAllAddress();

	List<AddressDto> viewAllAddressWithUserId(UUID userId);

	List<Object> findAddressEntity(Integer id);

	Optional<AddressEntity> getAddressWithUserIdandAddress(UUID userId, UUID addressId);

	Optional<AddressEntity> findWIthReferenceId(UUID referenceId);

	void deleteAlladdressOfUser(UUID userId) throws UserException;
}
