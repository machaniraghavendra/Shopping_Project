package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.OrderSchedulerEntity;
import com.shopping.query.command.entites.dto.OrderScheduleResponseDto;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.OrderSchedulerRepo;
import com.shopping.query.command.service.OrderService;
import com.shopping.query.command.service.ScheduledOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ScheduledOrderServiceImpl implements ScheduledOrderService {

     @Autowired
     OrderSchedulerRepo orderSchedulerRepo;

     @Autowired
     OrderService orderService;

     @Autowired
     MappersClass mapper;

     @Override
     public List<OrderScheduleResponseDto> getAllScheduledOrdersOfUser(UUID userId) {
          try {
               List<OrderScheduleResponseDto> orderSchedulerResponse = new ArrayList<>();
               var user = mapper.userDetailDtoMapper(userId);
               var scheduledOrders = orderSchedulerRepo.getAllByUserUuid(user.getUserId());
               for (var order : scheduledOrders){
                    var orderScheduler = new OrderScheduleResponseDto();
                    orderScheduler.setOrderScheduler(order);
                    orderScheduler.setItem(mapper.getItemEntityById(order.getOrderDetails().getItemId()));
                    orderSchedulerResponse.add(orderScheduler);
               }
               List<OrderScheduleResponseDto> jobIncompleteOrders = orderSchedulerResponse.stream().filter(order->!order.getOrderScheduler().getJobCompleted()).sorted(Comparator.comparing(order -> order.getOrderScheduler().getScheduledOn())).toList();
               List<OrderScheduleResponseDto> jobCompletedOrders = orderSchedulerResponse.stream().filter(order->order.getOrderScheduler().getJobCompleted()).sorted(Comparator.comparing(order -> order.getOrderScheduler().getScheduledOn(), Comparator.reverseOrder())).toList();
               orderSchedulerResponse.clear();
               orderSchedulerResponse.addAll(jobIncompleteOrders);
               orderSchedulerResponse.addAll(jobCompletedOrders);
               return orderSchedulerResponse;
          }catch (Exception e){
               log.error(e.getMessage());
               return null;
          }
     }

     @Override
     public OrderSchedulerEntity deleteScheduledOrder(UUID scheduledId) {
          try {
               var scheduledOrder = orderSchedulerRepo.findByUuid(scheduledId);
               if (scheduledOrder.getIsDeleted()) throw new OrderNotFoundException("This order is already unscheduled");
               scheduledOrder.setIsDeleted(Boolean.TRUE);
               orderService.unScheduleOrder(String.valueOf(scheduledOrder.getUuid()), "Order jobs");
               return orderSchedulerRepo.save(scheduledOrder);
          }catch (Exception e){
               log.error(e.getMessage());
               return null;
          }
     }
}
