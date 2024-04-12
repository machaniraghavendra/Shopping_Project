package com.shopping.query.command.configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.mapper.MappersClass;
import com.shopping.query.command.repos.OrderSchedulerRepo;
import com.shopping.query.command.service.OrderService;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
public class OrderScheduler extends QuartzJobBean {
     private static final Logger log = LoggerFactory.getLogger(OrderScheduler.class);

     @Autowired
     OrderService orderService;

     @Autowired
     OrderSchedulerRepo orderSchedulerRepo;

     @Autowired
     MappersClass mapper;

     @Override
//     @SneakyThrows
     protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
          log.info("Order scheduler started for job id: "+context.getJobDetail().getKey());
          JobDataMap jobDataMap = context.getMergedJobDataMap();
          ObjectMapper objectMapper = new ObjectMapper();
          objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
          try {
               OrdersEntity ordersEntity = objectMapper.readValue(jobDataMap.get("orderEntity").toString(), OrdersEntity.class);
               var response = orderService.saveOrderDetails(ordersEntity);
               if (response.equalsIgnoreCase("Saved order")) {
                    var orderScheduler = orderSchedulerRepo.findByUuid(UUID.fromString(context.getJobDetail().getKey().getName()));
                    orderScheduler.setJobCompleted(Boolean.TRUE);
                    orderSchedulerRepo.save(orderScheduler);
                log.info("Order created for scheduled time "+ context.getTrigger().getStartTime());
               }else throw new RuntimeException(response);
          }catch (Exception e){
               log.error(e.getMessage());
          }
     }
}
