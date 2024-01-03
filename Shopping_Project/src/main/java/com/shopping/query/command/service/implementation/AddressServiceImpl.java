package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.AddressEntity;
import com.shopping.query.command.entites.dto.AddressDto;
import com.shopping.query.command.exceptions.AddressAlreadyExistsException;
import com.shopping.query.command.exceptions.AddressNotFoundException;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.AddressRepo;
import com.shopping.query.command.service.AddressService;

@Service
@Slf4j
public class AddressServiceImpl implements AddressService {

     @Autowired
     private AddressRepo repo;

     @Autowired
     private GlobalExceptionHandler globalExceptionHandler;

     @Autowired
     private MappersClass mapper;

     private List<Object> result = new ArrayList<>();

     @Override
     public List<Object> saveAddress(AddressDto address) {
          result = new ArrayList<>();
          try {
               AddressEntity addressEntity = mapper.getAddressEnityWithDto(address);
               if (!viewAllAddress().isEmpty()) {
                    AddressDto addressDto = findAddressWithUserId(address.getUserId(), address.getDeliveryAddressUuid());
                    try {
                         if (!Objects.isNull(addressDto)
                              && addressDto.getDeliveryAddress().equals(address.getDeliveryAddress())
                              && addressDto.getUserId().equals(address.getUserId()))
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
          } catch (AddressNotFoundException e) {
               result.add(globalExceptionHandler.addressNotFoundException(e).getBody());
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
     public String deleteAddressWithReferenceId(UUID referenceId) {
          var address = getAddressWithReferenceId(referenceId);
          Optional<AddressEntity> addressEntity = getAddressWithUserIdandAddress(address.getUserId(), address.getDeliveryAddress().getUuid());
          if (!addressEntity.isEmpty()) {
               repo.delete(addressEntity.get());
               return "Deleted";
          } else {
               return "Not found";
          }
     }

     private AddressEntity getAddressWithReferenceId(UUID referenceId) {
          return repo.findByReferenceId(referenceId);
     }

     @Override
     public Optional<AddressEntity> getAddressWithUserIdandAddress(UUID userId, UUID addressId) {
          return viewAllAddress().stream().filter(a -> a.getUserId().equals(userId))
               .filter(a -> a.getDeliveryAddress().getUuid().equals(addressId)).findFirst();
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
     public AddressDto findAddress(Integer id) throws UserException {
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
     public List<AddressDto> viewAllAddressWithUserId(UUID userId) {
          List<AddressEntity> list = viewAllAddress().stream().filter(a -> a.getUserId().equals(userId))
               .sorted(Comparator.comparing(AddressEntity::getAddedOn, Comparator.reverseOrder()))
               .toList();
          List<AddressDto> returnList = new ArrayList<>();
          list.forEach(a -> {
               try {
                    returnList.add(mapper.addressDtoMapper(a));
               } catch (UserException e) {
                    log.error(e.getMessage());
               }
          });
          return returnList;
     }

     @Override
     public AddressDto findAddressWithUserId(UUID userId, UUID addressUuid) {
          Optional<AddressDto> addressDto = viewAllAddressWithUserId(userId).stream()
               .filter(a -> a.getDeliveryAddress().equals(addressUuid)).findFirst();
          return addressDto.orElse(null);
     }

     @Override
     public Optional<AddressEntity> findWIthReferenceId(UUID referenceId) {
          return viewAllAddress().stream().filter(a -> a.getReferenceId().equals(referenceId)).findFirst();
     }

     @Override
     public void deleteAlladdressOfUser(UUID userId) throws UserException {
          try {
               repo.deleteAll(viewAllAddress().stream().filter(a -> a.getUserId().equals(userId)).toList());
          } catch (Exception e) {
               throw new UserException(e.getMessage());
          }
     }
}
