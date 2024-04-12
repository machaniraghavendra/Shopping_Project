package com.shopping.query.command.service;

import com.shopping.query.command.entites.OrderSchedulerEntity;

import java.util.List;
import java.util.UUID;

public interface ScheduledOrderService {

     List<OrderSchedulerEntity> getAllScheduledOrdersOfUser(UUID userId);

     OrderSchedulerEntity deleteScheduledOrder(UUID scheduledId);

}
