package com.shopping.query.command.configuration;

import static org.apache.commons.io.IOUtils.resourceToString;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.service.ItemService;

@Component
public class ItemsInstaller implements CommandLineRunner {

	@Autowired
	private ItemService itemService;

	@Autowired
	private GlobalExceptionHandler exceptionHandler;

	private ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void run(String... args) throws Exception {
		objectMapper.registerModule(new JavaTimeModule());
		if (itemService.viewall().isEmpty()) {
			try {
				itemService.saveAll(getItemsFromFile());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public List<ItemEntity> getItemsFromFile() {
		List<ItemEntity> itemsList = new ArrayList<>();
		JSONArray items = readFileForItems();
		if (Objects.nonNull(items)) {
			try {
				for (int i = 0; i < items.length(); i++) {
					itemsList.add(objectMapper.readValue(items.get(i).toString(), ItemEntity.class));
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return itemsList;
	}

	public JSONArray readFileForItems() {
		JSONArray items = null;
		try {
			items = new JSONArray(resourceToString("files/Items_API.json", Charset.defaultCharset(),
					this.getClass().getClassLoader()));
		} catch (Exception e) {
			exceptionHandler.globalException(e).getBody();
		}
		return items;
	}
}
