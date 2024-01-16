package com.shopping.query.command.service.implementation;

import com.shopping.query.command.configuration.ItemsInstaller;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.SearchDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemAlreadyException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.ItemsRepo;
import com.shopping.query.command.service.ItemService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static com.shopping.query.command.configuration.Constants.*;

@Service
@Slf4j
public class ItemServiceImpl implements ItemService {

     @Autowired
     private ItemsRepo itemsRepo;

     @Autowired
     @Lazy
     private ItemsInstaller installer;

     @Autowired
     private GlobalExceptionHandler globalExceptionHandler;

     @Autowired
     @Lazy
     private MappersClass mappersClass;

     private Map<UUID, List<ItemsDto>> history = new HashMap<>();

     @Override
     public String addItem(ItemEntity itemEntity) throws ItemAlreadyException {
          try {
               if (itemsRepo.existsById(itemEntity.getItemId()))
                    throw new ItemAlreadyException("The item " + itemEntity.getItemName() + " already there");
               else {
                    if (!itemEntity.getItemPrice().contains(",")) {
                         itemEntity.setItemPrice(String.format("%,.2f", Double.valueOf(itemEntity.getItemPrice())));
                    }
                    if (itemEntity.isTrending()) {
                         checkAndDeleteTrendingItems();
                    }
                    itemsRepo.save(itemEntity);
                    return "Added !";

               }
          } catch (ItemAlreadyException | ItemNotFoundException e) {
               log.error(e.getMessage());
          }
          return "The item " + itemEntity.getItemName() + " already there";
     }

     private void checkAndDeleteTrendingItems() throws ItemNotFoundException {
          List<ItemEntity> trendingItems = new ArrayList<>();
          getTrendingItems().forEach(item -> {
               try {
                    trendingItems.add(mappersClass.getItemEntityById(item.getItemId()));
               } catch (ItemNotFoundException e) {
                    throw new RuntimeException(e);
               }
          });
          if (trendingItems.size() >= 9) {
               trendingItems.sort(Comparator.comparing(ItemEntity::getItemAddedOn));
               LinkedList<ItemEntity> trending = new LinkedList<>(trendingItems);
               ItemEntity itemEntity = trending.removeLast();
               itemEntity.setTrending(Boolean.FALSE);
               updateAsNonTrending(itemEntity);
          }
     }

     private void updateAsNonTrending(ItemEntity itemEntity) throws ItemNotFoundException {
          try {
               if (!itemsRepo.existsById(itemEntity.getItemId()))
                    throw new ItemNotFoundException("The item " + itemEntity.getItemName() + " not exists");
               else {
                    itemsRepo.save(itemEntity);
               }
          } catch (ItemNotFoundException e) {
               log.error(e.getMessage());
          }
     }

     @Override
     public String updateItem(ItemEntity itemEntity) throws ItemNotFoundException {
          try {
               if (!itemsRepo.existsById(itemEntity.getItemId()))
                    throw new ItemNotFoundException(String.format(ITEM_NOT_EXISTS, itemEntity.getItemName()));
               else {
                    if (!Objects.equals(itemEntity.isTrending(), mappersClass.getItemDtoById(itemEntity.getItemId()).isTrending()) && itemEntity.isTrending()) {
                         checkAndDeleteTrendingItems();
                    }
                    itemsRepo.save(itemEntity);
                    return "Updated !";
               }
          } catch (ItemNotFoundException e) {
               log.error(e.getMessage());
          }
          return String.format(ITEM_NOT_EXISTS, itemEntity.getItemName());
     }

     @Override
     public String delete(int itemId) throws ItemNotFoundException {
          try {
               if (!itemsRepo.existsById(itemId))
                    throw new ItemNotFoundException(String.format(ITEM_NOT_EXISTS, itemId));
               else {
                    itemsRepo.deleteById(itemId);
                    return "The item " + itemId + " has been removed ";
               }
          } catch (ItemNotFoundException e) {
               e.printStackTrace();
          }
          return String.format(ITEM_NOT_EXISTS, itemId);
     }

     @Override
     public List<Object> find(int itemId) throws ItemNotFoundException {
          List<Object> value = new ArrayList<>();
          try {
               if (!itemsRepo.existsById(itemId))
                    throw new ItemNotFoundException(String.format(ITEM_NOT_EXISTS, itemId));
               else {
                    value.add(itemsRepo.findById(itemId).orElseThrow(() -> new ItemNotFoundException(String.format(ITEM_NOT_EXISTS, itemId))));
               }
          } catch (ItemNotFoundException e) {
               value.add(globalExceptionHandler.itemNotFoundException(e));
          }
          return value;
     }

     @Override
     public boolean existsItemWithId(int itemId) throws ItemNotFoundException {
          return itemsRepo.existsById(itemId);
     }

     @Override
     public List<ItemEntity> viewall() {
          List<ItemEntity> listToShow = new ArrayList<>();
          var listOfItems = itemsRepo.findAll();
          listToShow.addAll(listOfItems.stream().filter(item -> Objects.nonNull(item.getItemAddedOn()))
               .sorted(Comparator.comparing(ItemEntity::getItemName, Comparator.reverseOrder()))
               .sorted(Comparator.comparing(ItemEntity::getItemAddedOn, Comparator.reverseOrder()))
               .sorted(Comparator.comparing(ItemEntity::isTrending, Comparator.reverseOrder())).toList());
          listToShow.addAll(listOfItems.stream().filter(item -> Objects.nonNull(item.getItemUpdatedOn()))
               .filter(item -> Objects.isNull(item.getItemAddedOn()))
               .sorted(Comparator.comparing(ItemEntity::getItemName, Comparator.reverseOrder()))
               .sorted(Comparator.comparing(ItemEntity::getItemUpdatedOn, Comparator.reverseOrder()))
               .sorted(Comparator.comparing(ItemEntity::isTrending, Comparator.reverseOrder())).toList());
          listToShow.sort(Comparator.comparing(ItemEntity::getRatingOfItem, Comparator.reverseOrder()));
          listToShow.sort(Comparator.comparing(ItemEntity::getTotalOrders, Comparator.reverseOrder()));
          return listToShow;
     }

     @Override
     public String saveAll(List<ItemEntity> itemEntity) throws ItemAlreadyException {
          int val = 0;
          try {
               for (ItemEntity item : itemEntity) {
                    val = item.getItemId();
                    if (itemsRepo.existsById(item.getItemId()))
                         throw new ItemAlreadyException("Already exists in data");
                    else {
                         item.setItemAddedOn(LocalDateTime.now());
                         this.addItem(item);
                    }
               }
               return "Saved list of Items";
          } catch (ItemAlreadyException e) {
               log.error(e.getMessage());
          }
          return "Already " + val + " exists in data";
     }

     @Override
     public String deleteAll() {
          itemsRepo.deleteAll();
          return "Deleted the all Items";
     }

     @Override
     public List<ItemsDto> getItemsByType(String itemType) {
          List<ItemsDto> itemsOfGivenType = new ArrayList<>();
          if (!itemType.isEmpty() && Objects.nonNull(itemType)) {
               Optional.ofNullable(viewall()).ifPresentOrElse(items -> {
                    items.stream().filter(item -> item.getItemType().toLowerCase().contains(itemType.trim().toLowerCase()))
                         .collect(Collectors.toList()).forEach(i -> {
                              try {
                                   itemsOfGivenType.add(mappersClass.convertItemEntityToDto(i));
                              } catch (ItemNotFoundException e) {
                                   globalExceptionHandler.itemNotFoundException(e);
                              }
                         });
               }, null);
          }
          return itemsOfGivenType;
     }

     @Override
     public List<ItemsDto> getTrendingItems() {
          List<ItemsDto> itemsOfTrending = new ArrayList<>();
          Optional.ofNullable(viewall())
               .ifPresentOrElse(items -> items.stream().filter(ItemEntity::isTrending).toList().forEach(i -> {
                    try {
                         itemsOfTrending.add(mappersClass.convertItemEntityToDto(i));
                    } catch (ItemNotFoundException e) {
                         globalExceptionHandler.itemNotFoundException(e);
                    }
               }), () -> Collections.emptyList());
          return itemsOfTrending.stream().sorted(Comparator.comparing(ItemsDto::getRatingOfItem)).toList();
     }

     @Override
     public Map<UUID, List<ItemsDto>> viewedHistory(UUID userId, int itemId) throws ItemNotFoundException {
          List<ItemsDto> items = new ArrayList<>();
          if (!(Objects.isNull(userId)) && itemId > 0 && (history.isEmpty() || !history.containsKey(userId))) {
               items.add(mappersClass.convertItemEntityToDto((ItemEntity) find(itemId).get(0)));
               history.put(userId, items);
          } else {
               List<ItemsDto> itemsDtos = history.get(userId);
               ItemsDto dto = mappersClass.convertItemEntityToDto((ItemEntity) find(itemId).get(0));
               if (!itemsDtos.isEmpty() && itemsDtos.size() <= 4 && !itemsDtos.contains(dto)) {
                    itemsDtos.add(dto);
               } else if (!itemsDtos.contains(dto)) {
                    itemsDtos.remove(0);
                    itemsDtos.add(dto);
               }
          }
          return history;
     }

     @Override
     public List<ItemsDto> getViewedHistory(UUID userId) {
          if (history.isEmpty() && Objects.isNull(userId)) {
               return Collections.emptyList();
          } else {
               if (history.containsKey(userId)) {
                    if (history.get(userId).isEmpty()) {
                         return Collections.emptyList();
                    } else {
                         return history.get(userId).stream()
                              .sorted(Comparator.comparing(ItemsDto::getItemPrice, Comparator.reverseOrder())).toList();
                    }
               }
               return Collections.emptyList();
          }
     }

     public List<ItemsDto> getItemsWithPagination(final Integer page, final Integer size) {
          Pageable pageable = PageRequest.of(page, size);
          List<ItemsDto> listOfItemsDto = new ArrayList<>();
          var listOfItems = itemsRepo.findAll(pageable).get().collect(Collectors.toCollection(ArrayList::new));
          listOfItems.forEach(item -> {
               try {
                    listOfItemsDto.add(mappersClass.convertItemEntityToDto(item));
               } catch (ItemNotFoundException e) {
                    throw new RuntimeException(e);
               }
          });
          return listOfItemsDto;
     }

     @Override
     public SearchDto itemSearch(String searchItem, UUID userId) throws ItemNotFoundException {
          searchItem = searchItem.trim().toLowerCase();
          searchItem = searchItem.contains("%20") ? searchItem.replace("%20", " ") : searchItem;
          log.info(searchItem);
          if (StringUtils.isEmpty(searchItem))
               return null;
          SearchDto search = new SearchDto();
          List<ItemsDto> items = new ArrayList<>();
          List<ItemsDto> relatedResult = new ArrayList<>();
          List<ItemsDto> actualResult = new ArrayList<>();
          List<ItemsDto> relatedActualResult = new ArrayList<>();
          String itemType = null;
          try {
               log.info("Mapping with entity to dto");
               for (ItemEntity item : viewall()) {
                    items.add(mappersClass.convertItemEntityToDto(item));
               }
               relatedResult = getFoundItems(items, searchItem);
               log.info("Got found items for query {}", searchItem);
               for (ItemsDto itemsDto : relatedResult) {
                    String[] values = itemsDto.getItemName().split(" ");
                    for (String value : values) {
                         if (value.toLowerCase().contains(searchItem.toLowerCase())) {
                              actualResult.add(itemsDto);
                         }
                    }
               }
               itemType = actualResult.isEmpty() ? "" : actualResult.get(0).getItemType();
               itemType = itemType.equalsIgnoreCase("Dresses For women") || itemType.equalsIgnoreCase("Dresses for men")
                    ? "Dresses"
                    : itemType;
               relatedActualResult = sortByType(relatedResult, actualResult, itemType);
               log.info("Sorting has done");
               search = getSearch(actualResult.size() >= 5 ? actualResult.subList(0, 5) : actualResult,
                    relatedActualResult, userId, searchItem);
          } catch (Exception e) {
               globalExceptionHandler.globalException(e);
               log.info("Exception occured with message {} with id {} of type {}", e.getMessage(), userId, e.getClass());
          }
          return search;
     }

     @Override
     public void updateItemData(Integer itemId, int operation, String updateType) {
          CompletableFuture.runAsync(() -> {
               try {
                    var result = find(itemId);
                    if (result.get(0) instanceof ItemEntity item) {
                         if (updateType.equalsIgnoreCase(ORDER)) {
                              if ((operation == -1 && item.getTotalOrders() != 0)||operation==1)
                                   item.setTotalOrders(item.getTotalOrders() + operation);
                         }
                         if (updateType.equalsIgnoreCase(REVIEW)) {
                              if ((operation == -1 && item.getTotalReviews() != 0)||operation==1)
                                   item.setTotalReviews(item.getTotalReviews() + operation);
                         }
                         updateItem(item);
                    }
               } catch (ItemNotFoundException e) {
                    log.error(e.getMessage());
               }
          });
     }

     private List<ItemsDto> getFoundItems(List<ItemsDto> items, String searchItem) {
          Set<ItemsDto> foundItems = new HashSet<>();
          if (!items.isEmpty()) {
               for (ItemsDto itemsDto : items) {
                    String itemName = itemsDto.getItemName().toLowerCase().trim();
                    char[] firstString = itemName.substring(0, itemName.length() / 2).toCharArray();
                    char[] secondString = itemName.substring(itemName.length() / 2, itemName.length()).toCharArray();
                    char[] searchArray = searchItem.toCharArray();
                    for (ItemsDto item : getFoundItem(searchArray, firstString, secondString, itemsDto)) {
                         foundItems.add(item);
                    }
               }
               foundItems = foundItems.stream()
                    .sorted(Comparator.comparing(ItemsDto::getRatingOfItem, Comparator.reverseOrder()))
                    .collect(Collectors.toSet());
          }
          return foundItems.stream().toList();
     }

     private List<ItemsDto> getFoundItem(char[] searchArray, char[] firstString, char[] secondString,
                                         ItemsDto itemsDto) {
          List<ItemsDto> foundItems = new ArrayList<>();

          for (int i = 0; i < searchArray.length; i++) {
               for (int j = 0; j < firstString.length; j++) {
                    if (searchArray[i] == firstString[j]) {
                         foundItems.add(itemsDto);
                         break;
                    }
               }
               for (int j = 0; j < secondString.length; j++) {
                    if (searchArray[i] == secondString[j]) {
                         foundItems.add(itemsDto);
                         break;
                    }
               }
          }
          return foundItems;
     }

     private List<ItemsDto> sortByType(List<ItemsDto> list, List<ItemsDto> actualResult, String type) {
          List<ItemsDto> relatedResult = list;
          List<ItemsDto> relatedActualResult = new ArrayList<>();
          relatedResult = relatedResult.stream().collect(Collectors.toSet()).stream().sorted((o1, o2) -> {
               if ((o1.getItemType().equalsIgnoreCase(type))) {
                    return -1;
               } else if ((o2.getItemType().equalsIgnoreCase(type))) {
                    return 1;
               } else {
                    return o1.getItemName().compareTo(o2.getItemName());
               }
          }).toList();
          for (ItemsDto itemsDto : relatedResult) {
               if (!actualResult.contains(itemsDto)) {
                    relatedActualResult.add(itemsDto);
               }
          }
          List<ItemsDto> ratingSortedItems = new ArrayList<>();
          ratingSortedItems = relatedActualResult.stream().filter(item -> item.getItemType().equalsIgnoreCase(type))
               .sorted(Comparator.comparing(ItemsDto::getRatingOfItem, Comparator.reverseOrder())).toList();
          relatedActualResult.removeAll(ratingSortedItems);
          relatedActualResult.addAll(ratingSortedItems);
          Collections.rotate(relatedActualResult, ratingSortedItems.size());
          return relatedActualResult;
     }

     private SearchDto getSearch(List<ItemsDto> actualResult, List<ItemsDto> relatedActualResult, UUID userId,
                                 String query) throws UserException {
          if (mappersClass.userDetailDtoMapper(userId).getUserEmail().isEmpty()
               || Objects.isNull(mappersClass.userDetailDtoMapper(userId).getUserEmail())) {
               throw new UserException("No user presents with this Id " + userId);
          }
          return SearchDto.builder().count(actualResult.size()).actualResult(actualResult)
               .relatedResult(relatedActualResult.subList(0,
                    relatedActualResult.size() > 15 ? 15 : relatedActualResult.size()))
               .suggestions(history.isEmpty() || history.get(userId).isEmpty() ? Collections.emptyList()
                    : history.get(userId))
               .query(query).build();
     }
}
