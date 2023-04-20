package com.shopping.query.command.service;

import java.util.List;

import com.shopping.query.command.entites.OrderDetailsOfUserEntity;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.exceptions.OrderWithSameItemExistsException;

public interface OrderDetailsService {

	List<Object> saveOrder(OrderDetailsOfUserEntity orderDetailsOfUser) throws OrderWithSameItemExistsException;

	List<OrderDetailsOfUserEntity> getAllOrders();

	List<Object> getOrderDetailsOfUser(int orderId) throws OrderNotFoundException;
}
