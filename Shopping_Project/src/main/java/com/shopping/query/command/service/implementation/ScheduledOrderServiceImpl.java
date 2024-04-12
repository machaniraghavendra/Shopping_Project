package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.OrderSchedulerEntity;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.OrderSchedulerRepo;
import com.shopping.query.command.service.ScheduledOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ScheduledOrderServiceImpl implements ScheduledOrderService {

     @Autowired
     OrderSchedulerRepo orderSchedulerRepo;

     @Autowired
     MappersClass mapper;

     @Override
     public List<OrderSchedulerEntity> getAllScheduledOrdersOfUser(UUID userId) {
          try {
               var user = mapper.userDetailDtoMapper(userId);
               return orderSchedulerRepo.getAllByUserUuid(user.getUserId()).stream().sorted(Comparator.comparing(OrderSchedulerEntity::getScheduledOn)).toList();
          }catch (Exception e){
               log.error(e.getMessage());
               return null;
          }
     }

     @Override
     public OrderSchedulerEntity deleteScheduledOrder(UUID scheduledId) {
          try {
               var scheduledOrder = orderSchedulerRepo.findByUuid(scheduledId);
               scheduledOrder.setIsDeleted(Boolean.TRUE);
               return orderSchedulerRepo.save(scheduledOrder);
          }catch (Exception e){
               log.error(e.getMessage());
               return null;
          }
     }
}
