package com.shopping.query.command.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.exceptions.OrderWithSameItemExistsException;
import com.shopping.query.command.exceptions.UserNotFoundException;

public interface OrderService {

	boolean saveOrderByCheckingAddress(OrdersEntity ordersEntity) throws UserNotFoundException;

	String saveOrderDetails(OrdersEntity ordersEntity)
			throws OrderNotFoundException, ItemNotFoundException, OrderWithSameItemExistsException;

	OrdersEntity findByDeliveryDetailId(Integer id);

	List<OrdersEntity> getAllOrders();

	String deleteDetailsWithId(Integer id);

	List<Object> updateOrder(UUID orderUUID, String orderStatus) throws OrderNotFoundException;

	OrdersDto findItemDetailsWithId(Integer id) throws ItemNotFoundException;

	List<Object> saveOrderToView(UUID id) throws ItemNotFoundException;

	List<Object> getSavedOrder();

	List<OrdersDto> getOrdersofUser(UUID userId);

	void updateOrderStatus(UUID orderid) throws OrderNotFoundException;

	List<String> getAllEmailsOfUser(UUID userId) throws UserNotFoundException;
	
	String getDate(LocalDateTime date);

	String getTime(LocalDateTime date);

	OrdersDto getOrderDtowithOrderUUID(UUID orderId) throws ItemNotFoundException;
	
	OrdersEntity getWithUUID(UUID uuid);
}
