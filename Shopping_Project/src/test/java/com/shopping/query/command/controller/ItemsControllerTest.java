package com.shopping.query.command.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.service.ItemService;

class ItemsControllerTest {

	@InjectMocks
	private ItemsController controller;

	@Mock
	private ItemService itemService;
	
	private MockMvc mockMvc;
	
	private ItemEntity itemEntity;
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		itemEntity=ItemEntity.builder().ItemId(1).itemName("Item").ItemPrice("2000").ItemType("Mobile").build();
	}

	@Test
	void testSave() throws Exception {
		this.mockMvc.perform(post("/items/").contentType(MediaType.APPLICATION_JSON).
				content(new ObjectMapper().writeValueAsString(itemEntity).getBytes())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testSaveall() throws Exception {
		this.mockMvc.perform(post("/items/all").contentType(MediaType.APPLICATION_JSON).
				content(new ObjectMapper().writeValueAsString(Arrays.asList(itemEntity)).getBytes())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testUpdate() throws  Exception {
		this.mockMvc.perform(put("/items/").contentType(MediaType.APPLICATION_JSON).
				content(new ObjectMapper().writeValueAsString(itemEntity).getBytes())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testDelete() throws  Exception {
		this.mockMvc.perform(delete("/items/1").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testDeleteAll() throws Exception {
		this.mockMvc.perform(delete("/items/").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testFind() throws Exception {
		this.mockMvc.perform(get("/items/1").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testViewall() throws Exception {
		this.mockMvc.perform(get("/items/").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

}
