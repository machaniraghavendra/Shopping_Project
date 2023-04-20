package com.shopping.query.command.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.shopping.query.command.service.implementation.PurchaseImpl;

class PurchaseControllerTest {

	@InjectMocks
	private PurchaseController controller;

	@Mock
	private PurchaseImpl impl;

	private MockMvc mockMvc;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
	}

	@Test
	void testPurchaseItem() throws Exception {
		this.mockMvc
				.perform(get("/purchase/1").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void testGetItem() throws Exception {
		this.mockMvc
				.perform(get("/purchase/").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is2xxSuccessful());
	}

}