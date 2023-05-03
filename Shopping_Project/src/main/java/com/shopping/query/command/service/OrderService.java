package com.shopping.query.command.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.exceptions.OrderWithSameItemExistsException;

public interface OrderService {

	String saveOrderDetails(OrdersEntity ordersEntity)
			throws OrderNotFoundException, ItemNotFoundException, OrderWithSameItemExistsException;

	OrdersEntity findByDeliveryDetailId(Integer id);

	List<OrdersEntity> getAllOrders();

	String deleteDetailsWithId(Integer id);

	List<Object> updateOrder(UUID orderUUID, String orderStatus) throws OrderNotFoundException;

	OrdersDto findItemDetailsWithId(Integer id) throws ItemNotFoundException;

	List<Object> saveOrderToView(UUID id) throws ItemNotFoundException;

	List<Object> getSavedOrder();

	List<OrdersDto> getOrdersofUser(String userId);

	String getDate(LocalDateTime date);

	String getTime(LocalDateTime date);
}
