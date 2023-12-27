package com.shopping.query.command.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.entites.dto.SearchDto;
import com.shopping.query.command.exceptions.ItemAlreadyException;
import com.shopping.query.command.exceptions.ItemNotFoundException;

public interface ItemService {
	String addItem(ItemEntity itemEntity) throws ItemAlreadyException;

	String saveAll(List<ItemEntity> itemEntity) throws ItemAlreadyException;

	String updateItem(ItemEntity itemEntity) throws ItemNotFoundException;

	String delete(int itemId) throws ItemNotFoundException;

	String deleteAll();

	List<Object> find(int itemId) throws ItemNotFoundException;

	boolean existsItemWithId(int itemId) throws ItemNotFoundException;

	List<ItemEntity> viewall();

	List<ItemsDto> getItemsWithPagination(final Integer page, final Integer size);

	List<ItemsDto> getItemsByType(String itemType);

	List<ItemsDto> getTrendingItems();

	Map<UUID, List<ItemsDto>> viewedHistory(UUID userId, int itemId) throws ItemNotFoundException;

	List<ItemsDto> getViewedHistory(UUID userId);
	
	SearchDto itemSearch(String searchword, UUID userId) throws ItemNotFoundException;

     void updateItemData(Integer itemId, int operation, String updateType);
}
