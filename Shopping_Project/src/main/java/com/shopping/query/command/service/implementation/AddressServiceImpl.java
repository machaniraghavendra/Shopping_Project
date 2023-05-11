package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.exceptions.AddressAlreadyExistsException;
import com.shopping.query.command.exceptions.AddressNotFoundException;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.UserNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.AddressRepo;
import com.shopping.query.command.service.AddressService;

@Service
public class AddressServiceImpl implements AddressService {

	@Autowired
	private AddressRepo repo;

	@Autowired
	private GlobalExceptionHandler globalExceptionHandler;

	@Autowired
	private MappersClass mapper;

	private List<Object> result = new ArrayList<>();

	@Override
	public List<Object> saveAddress(AddressEntity addressEntity) {
		result = new ArrayList<>();
		addressEntity.setReferenceId(UUID.randomUUID());
		if (!viewAllAddress().isEmpty()) {
			AddressDto entity = findAddressWithUserId(addressEntity.getUserId(), addressEntity.getDeliveryAddress());
			try {
				if (!Objects.isNull(entity)
						&& entity.getDeliveryAddress().equalsIgnoreCase(addressEntity.getDeliveryAddress())
						&& entity.getUserDetails().getUserEmail().equalsIgnoreCase(addressEntity.getUserId()))
					throw new AddressAlreadyExistsException("Same address already exists");
				else {
					repo.save(addressEntity);
					result.add("Address added");
				}
			} catch (AddressAlreadyExistsException e) {
				result.add(globalExceptionHandler.addressAlreadyExistsException(e).getBody());
			}
		} else {
			repo.save(addressEntity);
			result.add("Address added");
		}
		return result;
	}

	@Override
	public List<Object> updateAddress(AddressEntity addressEntity) {
		result = new ArrayList<>();
		try {
			AddressEntity addressEntityForId = findWIthReferenceId(addressEntity.getReferenceId()).get();
			addressEntity.setAddressId(addressEntityForId.getAddressId());
			if (repo.existsById(addressEntity.getAddressId())) {
				repo.save(addressEntity);
				result.add("Address got updated");
			} else {
				throw new AddressNotFoundException("Address not found with id " + addressEntity.getAddressId());
			}
		} catch (AddressNotFoundException e) {
			result.add(globalExceptionHandler.addressNotFoundException(e).getBody());
		}
		return result;
	}

	@Override
	public List<Object> deleteAddress(Integer id) {
		result = new ArrayList<>();
		try {
			if (repo.existsById(id)) {
				repo.deleteById(id);
				result.add("Deleted address with id " + id);
			} else {
				throw new AddressNotFoundException("There is no address with this id " + id);
			}
		} catch (AddressNotFoundException e) {
			result.add(globalExceptionHandler.addressNotFoundException(e).getBody());
		}
		return result;
	}

	@Override
	public String deleteAddressWithUserIdAndAddress(String userId, String address) {
		Optional<AddressEntity> addressEntity = getAddressWithUserIdandAddress(userId, address);
		if (!addressEntity.isEmpty()) {
			repo.delete(addressEntity.get());
			return "Deleted";
		} else {
			return "Not found";
		}
	}

	@Override
	public Optional<AddressEntity> getAddressWithUserIdandAddress(String userId, String address) {
		return viewAllAddress().stream().filter(a -> a.getUserId().equals(userId))
				.filter(a -> a.getDeliveryAddress().equals(address)).findFirst();
	}

	@Override
	public List<Object> findAddressEntity(Integer id) {
		result = new ArrayList<>();
		try {
			if (repo.existsById(id)) {
				result.add(repo.findById(id).get());
			} else {
				throw new AddressNotFoundException("There is no address with id " + id);
			}
		} catch (AddressNotFoundException e) {
			result.add(globalExceptionHandler.addressNotFoundException(e).getBody());
		}
		return result;
	}

	@Override
	public AddressDto findAddress(Integer id) throws UserNotFoundException {
		List<Object> entity = findAddressEntity(id);
		if (entity.stream().anyMatch(a -> a instanceof AddressEntity))
			return mapper.addressDtoMapper((AddressEntity) entity);
		return null;
	}

	@Override
	public List<AddressEntity> viewAllAddress() {
		return repo.findAll();
	}

	@Override
	public List<AddressDto> viewAllAddressWithUserId(String userId) {
		List<AddressEntity> list = viewAllAddress().stream().filter(a -> a.getUserId().equals(userId))
				.collect(Collectors.toList());
		List<AddressDto> returnList = new ArrayList<>();
		list.forEach(a -> {
			try {
				returnList.add(mapper.addressDtoMapper(a));
			} catch (UserNotFoundException e) {
				e.printStackTrace();
			}
		});
		return returnList;
	}

	@Override
	public AddressDto findAddressWithUserId(String userId, String address) {
		Optional<AddressDto> addressDto = viewAllAddressWithUserId(userId).stream()
				.filter(a -> a.getDeliveryAddress().equals(address)).findFirst();
		if (!addressDto.isEmpty()) {
			return addressDto.get();
		}
		return null;
	}

	@Override
	public Optional<AddressEntity> findWIthReferenceId(UUID referenceId) {
		return viewAllAddress().stream().filter(a -> a.getReferenceId().equals(referenceId)).findFirst();
	}
}
