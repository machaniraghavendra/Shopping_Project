package com.shopping.query.command.service;

import com.shopping.query.command.entites.OrderSchedulerEntity;
import com.shopping.query.command.entites.dto.OrderScheduleResponseDto;

import java.util.List;
import java.util.UUID;

public interface ScheduledOrderService {

     List<OrderScheduleResponseDto> getAllScheduledOrdersOfUser(UUID userId);

     OrderSchedulerEntity deleteScheduledOrder(UUID scheduledId);

     OrderScheduleResponseDto getScheduledOrderDetailsByUuid(UUID scheduledId);

}
