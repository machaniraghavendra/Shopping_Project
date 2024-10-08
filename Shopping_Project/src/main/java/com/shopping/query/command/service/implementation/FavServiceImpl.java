package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopping.query.command.entites.FavouritesEntity;
import com.shopping.query.command.entites.dto.FavouriteDto;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.ItemAlreadyInFavException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.ItemNotFoundInFavException;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.FavRepo;
import com.shopping.query.command.service.FavService;

@Service
public class FavServiceImpl implements FavService {

     private final static Logger log = LoggerFactory.getLogger(FavServiceImpl.class);

     @Autowired
     private FavRepo favRepo;

     @Autowired
     private MappersClass mapper;

     @Override
     public String save(FavouritesEntity favouritesEntity) throws ItemAlreadyInFavException, ItemNotFoundException {
          String itemName = mapper.getItemDtoById(favouritesEntity.getItemId()).getItemName();
          try {
               List<FavouritesEntity> favList = viewall().stream()
                    .filter(a -> a.getUserId().equals(favouritesEntity.getUserId()))
                    .filter(a -> Objects.equals(a.getItemId(), favouritesEntity.getItemId()))
                    .toList();
               if (!favList.isEmpty())
                    throw new ItemAlreadyInFavException("The item " + itemName + " already in your favourites");
               else {
                    favRepo.save(favouritesEntity);
                    return "Added to your Wishlist";
               }
          } catch (ItemAlreadyInFavException e) {
               log.error(e.getMessage());
               return e.getMessage();
          }
     }

     @Override
     public String update(FavouritesEntity favouritesEntity) throws ItemNotFoundInFavException, ItemNotFoundException {
          String itemName = mapper.getItemDtoById(favouritesEntity.getItemId()).getItemName();
          try {
               if (!favRepo.existsById(favouritesEntity.getItemId()))
                    throw new ItemNotFoundInFavException("The item " + itemName + " not exists in your Favourites");
               else {
                    favRepo.save(favouritesEntity);
                    return "Updated in your Wishlist";
               }
          } catch (ItemNotFoundInFavException e) {
               log.error(e.getMessage());
               return e.getMessage();
          }
     }

     @Override
     public String delete(String itemName, UUID userId) throws ItemNotFoundInFavException, ItemNotFoundException {
          Integer itemId = checkandgetlistWithUserId(userId).stream()
               .filter(a -> a.getItemName().equalsIgnoreCase(itemName)).map(a -> a.getItemId()).findFirst().get();
          FavouritesEntity favEntity = viewall().stream().filter(a -> a.getItemId() == itemId).findFirst().get();
          try {
               if (!favRepo.existsById(favEntity.getFavId()))
                    throw new ItemNotFoundInFavException("The item " + favEntity.getFavId() + " not exists in your Favourites");
               else {
                    favRepo.deleteById(favEntity.getFavId());
                    return "The item " + itemName + " has been removed from your Favourites";
               }
          } catch (ItemNotFoundInFavException e) {
               log.error(e.getMessage());
               return e.getMessage();
          }
     }

     @Override
     public FavouriteDto find(int favId) throws ItemNotFoundInFavException, UserException, ItemNotFoundException {
          try {
               if (!favRepo.existsById(favId))
                    throw new ItemNotFoundInFavException("The item " + favId + " not exists in your Favourites");
               else {
                    FavouritesEntity entity = favRepo.findById(favId).get();
                    return FavouriteDto.builder().user(mapper.userDetailDtoMapper(entity.getUserId()))
                         .item(mapper.getItemDtoById(entity.getItemId())).build();
               }
          } catch (ItemNotFoundInFavException e) {
               log.error(e.getMessage());
          }
          return new FavouriteDto();
     }

     @Override
     public List<FavouritesEntity> viewall() {
          return favRepo.findAll();
     }

     @Override
     public List<Map<UUID, List<ItemsDto>>> viewallMap() throws UserException, ItemNotFoundException {
          List<Map<UUID, List<ItemsDto>>> list = new ArrayList<>();
          Map<UUID, List<ItemsDto>> item = new HashMap<>();
          List<FavouritesEntity> itemEntities = viewall();
          if (Objects.nonNull(itemEntities)) {
               for (int i = 0; i < itemEntities.size(); i++) {
                    UUID userId = mapper.userDetailDtoMapper(itemEntities.get(i).getUserId()).getUserId();
                    ItemsDto itemsDto = mapper.getItemDtoById(itemEntities.get(i).getItemId());
                    if (checkandgetlistWithUserId(userId).isEmpty()) {
                         item.put(userId, Arrays.asList(itemsDto));
                    } else {
                         List<ItemsDto> dtos = checkandgetlistWithUserId(userId);
                         dtos.add(itemsDto);
                         item.put(userId, dtos);
                         item.get(userId).remove(itemsDto);
                    }
               }
               list.add(item);
          }
          return list;
     }

     @Override
     public void deleteAllCartItemsOfUser(UUID userId) throws UserException {
          try {
               favRepo.deleteAll(viewall().stream().filter(a -> a.getUserId().equals(userId)).toList());
          } catch (Exception e) {
               throw new UserException(e.getMessage());
          }
     }

     private List<ItemsDto> checkandgetlistWithUserId(UUID userId) {
          List<FavouritesEntity> entities = viewall();
          return entities.stream().filter(a -> a.getUserId().equals(userId)).map(a -> {
               try {
                    return mapper.getItemDtoById(a.getItemId());
               } catch (ItemNotFoundException e) {
                    log.error(e.getMessage());
               }
               return null;
          }).collect(Collectors.toList());
     }

     public List<List<ItemsDto>> getListofFavItemswithUserId(UUID userId)
          throws UserException, ItemNotFoundException {
          return viewallMap().stream().map(a -> a.getOrDefault(userId, null)).collect(Collectors.toList());
     }

}
