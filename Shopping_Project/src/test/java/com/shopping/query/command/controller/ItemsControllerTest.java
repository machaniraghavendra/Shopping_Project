package com.shopping.query.command.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.repos.ItemsRepo;
import com.shopping.query.command.service.ItemService;

@WebMvcTest(controllers  = ItemsController.class)
class ItemsControllerTest {
	
	private ItemEntity itemEntity;
	
	@Autowired
	private MockMvc mock;
	
	@MockBean
	private ItemService itemService;
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
//		mock = MockMvcBuilders.standaloneSetup(controller).build();
		itemEntity=ItemEntity.builder().ItemId(1).itemName("Item").ItemPrice("2000").ItemType("Mobile").build();
	}

	@Test
	void testSave() throws Exception {
		when(itemService.viewall()).thenReturn(List.of(itemEntity));
		mock.perform(post("/items/").contentType(MediaType.APPLICATION_JSON).
				content(new ObjectMapper().writeValueAsString(itemEntity).getBytes())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testSaveall() throws Exception {
		mock.perform(post("/items/all").contentType(MediaType.APPLICATION_JSON).
				content(new ObjectMapper().writeValueAsString(Arrays.asList(itemEntity)).getBytes())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testUpdate() throws  Exception {
		mock.perform(put("/items/").contentType(MediaType.APPLICATION_JSON).
				content(new ObjectMapper().writeValueAsString(itemEntity).getBytes())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testDelete() throws  Exception {
		mock.perform(delete("/items/1").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testDeleteAll() throws Exception {
		mock.perform(delete("/items/").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testFind() throws Exception {
		mock.perform(get("/items/1").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testViewall() throws Exception {
		mock.perform(get("/items/").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

}
