package com.shopping.query.command.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.query.command.entites.BotEntity;
import com.shopping.query.command.service.implementation.BotServiceImpl;

class BotControllerTest {

	@InjectMocks
	private BotController botController;

	@Mock
	private BotServiceImpl botServiceImpl;
	
	private MockMvc mockMvc;

	private BotEntity bot;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		this.mockMvc = MockMvcBuilders.standaloneSetup(botController).build();
		bot = BotEntity.builder().id(UUID.randomUUID()).userMessage("HI").botMessage("Hello").botReturnedAt("12")
				.userMessagedAt("12").build();
	}

	@Test
	void testGetResponse() throws  Exception {
		this.mockMvc.perform(post("/bot/").contentType(MediaType.APPLICATION_JSON)
				.content(new ObjectMapper().writeValueAsString(bot).getBytes()).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testViewAllResponse() throws  Exception {
		this.mockMvc.perform(get("/bot/").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testListClear() throws  Exception {
		this.mockMvc.perform(post("/bot/raghu@gmail.com").contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

}
