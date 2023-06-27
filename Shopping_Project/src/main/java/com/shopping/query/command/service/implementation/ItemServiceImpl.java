package com.shopping.query.command.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.entites.dto.ItemsDto;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemAlreadyException;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.ItemsRepo;
import com.shopping.query.command.service.ItemService;

@Service
public class ItemServiceImpl implements ItemService {

	@Autowired
	private ItemsRepo itemsRepo;

	private GlobalExceptionHandler globalExceptionHandler;

	private MappersClass mappersClass = new MappersClass();

	@Override
	public String save(ItemEntity itemEntity) throws ItemAlreadyException {
		try {
			if (itemsRepo.existsById(itemEntity.getItemId()))
				throw new ItemAlreadyException("The item " + itemEntity.getItemName() + " already there");
			else {
				itemsRepo.save(itemEntity);
				return "Added !";
			}
		} catch (ItemAlreadyException e) {
			e.printStackTrace();
		}
		return "The item " + itemEntity.getItemName() + " already there";
	}

	@Override
	public String update(ItemEntity itemEntity) throws ItemNotFoundException {
		try {
			if (!itemsRepo.existsById(itemEntity.getItemId()))
				throw new ItemNotFoundException("The item " + itemEntity.getItemName() + " not exists");
			else {
				if ((getTrendingItems().isEmpty() || getTrendingItems().size() < 9) || !itemEntity.isTrending()) {
					itemsRepo.save(itemEntity);
					return "Updated !";
				}
				return "Trending items are enough more";
			}
		} catch (ItemNotFoundException e) {
			e.printStackTrace();
		}
		return "The item " + itemEntity.getItemName() + " not exists";
	}

	@Override
	public String delete(int itemId) throws ItemNotFoundException {
		try {
			if (!itemsRepo.existsById(itemId))
				throw new ItemNotFoundException("The item " + itemId + " not exists ");
			else {
				itemsRepo.deleteById(itemId);
				return "The item " + itemId + " has been removed ";
			}
		} catch (ItemNotFoundException e) {
			e.printStackTrace();
		}
		return "The item " + itemId + " not exists ";
	}

	@Override
	public List<Object> find(int itemId) throws ItemNotFoundException {
		List<Object> value = new ArrayList<>();
		try {
			if (!itemsRepo.existsById(itemId))
				throw new ItemNotFoundException("The item " + itemId + " not exists in your cart");
			else {
				value.add(itemsRepo.findById(itemId).get());
			}
		} catch (ItemNotFoundException e) {
			value.add(globalExceptionHandler.itemNotFoundException(e));
		}
		return value;
	}

	@Override
	public List<ItemEntity> viewall() {
		return itemsRepo.findAll();
	}

	@Override
	@Transactional
	public String saveAll(List<ItemEntity> itemEntity) throws ItemAlreadyException {
		int val = 0;
		try {
			for (ItemEntity item : itemEntity) {
				val = item.getItemId();
				if (itemsRepo.existsById(item.getItemId()))
					throw new ItemAlreadyException("Already exists in data");
				else {
					itemsRepo.saveAll(itemEntity);
					return "Saved list of Items";
				}
			}
		} catch (ItemAlreadyException e) {
			e.printStackTrace();
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
								itemsOfGivenType.add(mappersClass.itemDtoMapperByEntity(i));
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
		Optional.ofNullable(viewall()).ifPresentOrElse(items -> {
			items.stream().filter(item -> item.isTrending()).collect(Collectors.toList()).forEach(i -> {
				try {
					itemsOfTrending.add(mappersClass.itemDtoMapperByEntity(i));
				} catch (ItemNotFoundException e) {
					globalExceptionHandler.itemNotFoundException(e);
				}
			});
		}, null);
		return itemsOfTrending;
	}

}
