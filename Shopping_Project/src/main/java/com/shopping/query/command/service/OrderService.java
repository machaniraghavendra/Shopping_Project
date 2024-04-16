package com.shopping.query.command.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.entites.dto.OrderSchedulerResponseDto;
import com.shopping.query.command.entites.dto.OrdersDto;
import com.shopping.query.command.exceptions.*;

public interface OrderService {

	boolean saveOrderByCheckingAddress(OrdersEntity ordersEntity) throws UserException;

	String saveOrderDetails(OrdersEntity ordersEntity)
            throws OrderNotFoundException, ItemNotFoundException, OrderWithSameItemExistsException, MailingException;

	OrdersEntity findByDeliveryDetailId(Integer id);

	List<OrdersEntity> getAllOrders();

	String deleteDetailsWithId(Integer id);

	List<Object> updateOrder(UUID orderUUID, String orderStatus) throws OrderNotFoundException, ItemNotFoundException;

	OrdersDto findItemDetailsWithId(Integer id) throws ItemNotFoundException;

	List<Object> saveOrderToView(UUID id) throws ItemNotFoundException;

	List<Object> getSavedOrder();

	List<OrdersDto> getOrdersofUser(UUID userId);

	void deleteAllOrdersofUser(UUID userId) throws UserException;
	
	void updateOrderStatus(UUID orderid) throws OrderNotFoundException, ItemNotFoundException;

	List<String> getAllEmailsOfUser(UUID userId) throws UserException;
	
	String getDate(LocalDateTime date);

	String getTime(LocalDateTime date);

	OrdersDto getOrderDtowithOrderUUID(UUID orderId) throws ItemNotFoundException;
	
	OrdersEntity getWithUUID(UUID uuid);

	OrderSchedulerResponseDto scheduleOrder(OrdersEntity order, LocalDateTime scheduleAt, ZoneId zoneId);
	void unScheduleOrder(String jobName, String groupName);
}
