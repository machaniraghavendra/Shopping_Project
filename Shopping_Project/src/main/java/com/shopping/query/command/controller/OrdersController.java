package com.shopping.query.command.controller;

import java.util.List;
import java.util.UUID;

import com.shopping.query.command.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/orders/")
@Tag(name = "Order Details", description = "Gives all order data")
public class OrdersController {

	@Autowired
	private OrderService ordersServImpl;

	@PostMapping("/")
	public ResponseEntity<String> saveOrder(@RequestBody OrdersEntity ordersEntity)
			throws OrderNotFoundException, ItemNotFoundException, OrderWithSameItemExistsException, MailingException {
		return ResponseEntity.ok(ordersServImpl.saveOrderDetails(ordersEntity));
	}

	@PostMapping("/check/")
	public ResponseEntity<Boolean> saveOrderByCheckingAddress(@RequestBody OrdersEntity ordersEntity)
			throws UserException {
		return ResponseEntity.ok(ordersServImpl.saveOrderByCheckingAddress(ordersEntity));
	}

	@PutMapping("updateOrder/{id}/{status}")
	public ResponseEntity<List<Object>> updateOrder(@PathVariable("id") UUID id, @PathVariable("status") String status)
			throws OrderNotFoundException, ItemNotFoundException {
		return ResponseEntity.ok(ordersServImpl.updateOrder(id, status));
	}

	@PutMapping("updateOrderStatus/{id}")
	public void updateOrderStatus(@PathVariable("id") UUID id) throws OrderNotFoundException, ItemNotFoundException {
		ordersServImpl.updateOrderStatus(id);
	}

	@GetMapping("/all")
	public ResponseEntity<List<OrdersEntity>> getAll() {
		return ResponseEntity.ok(ordersServImpl.getAllOrders());
	}

	@GetMapping("/orderWithUser")
	public ResponseEntity<List<OrdersDto>> getOrdersofUser(@RequestParam("userId") UUID userId)
			throws ItemNotFoundException {
		return ResponseEntity.ok(ordersServImpl.getOrdersofUser(userId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrdersDto> findItemDetailsWithId(@PathVariable("id") Integer id)
			throws ItemNotFoundException {
		return ResponseEntity.ok(ordersServImpl.findItemDetailsWithId(id));
	}

	@GetMapping("/saveorder/{id}")
	public ResponseEntity<List<Object>> saveOrderToView(@PathVariable("id") UUID id) throws ItemNotFoundException {
		return ResponseEntity.ok(ordersServImpl.saveOrderToView(id));
	}

	@GetMapping("/getAllMailsOfUser")
	public ResponseEntity<List<String>> getAllEmailsOfUser(@RequestParam("id") UUID id) throws UserException {
		return ResponseEntity.ok(ordersServImpl.getAllEmailsOfUser(id));
	}

	@GetMapping("/")
	public ResponseEntity<List<Object>> getSavedOrder() {
		return ResponseEntity.ok(ordersServImpl.getSavedOrder());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteDetailsWithId(@PathVariable("id") Integer id) {
		return ResponseEntity.ok(ordersServImpl.deleteDetailsWithId(id));
	}
}
