package com.shopping.query.command.batch;

import com.shopping.query.command.entites.OrdersEntity;
import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Objects;

@Component
@Slf4j
public class OrdersWriter implements ItemWriter<OrdersEntity>, StepExecutionListener {

     StepExecution stepExecution;

     @Autowired
     private GlobalExceptionHandler globalExceptionHandler;

     @Autowired
     private OrderService orderService;
     @Override
     public void beforeStep(StepExecution stepExecution){
          this.stepExecution = stepExecution;
     }

     @Override
     public void write(Chunk<? extends OrdersEntity> list) throws Exception {
//          return list -> {
               for (OrdersEntity order : list) {
                    ExecutionContext executionContext = stepExecution.getExecutionContext();
                    try {
                         log.info("Updating order : {} at {}", order.getOrderUUIDId(), LocalDateTime.now());
                         orderService.updateOrderStatus(order.getOrderUUIDId());
                         log.info("Updated order : {} at {}", order.getOrderUUIDId(), LocalDateTime.now());
                    } catch (OrderNotFoundException | ItemNotFoundException e) {
                         if (e instanceof OrderNotFoundException)
                              log.error(Objects.requireNonNull(globalExceptionHandler
                                        .orderNotFoundException((OrderNotFoundException) e).getBody())
                                   .getErrorMessage());
                         if (e instanceof ItemNotFoundException)
                              log.error(Objects.requireNonNull(
                                        globalExceptionHandler.itemNotFoundException((ItemNotFoundException) e).getBody())
                                   .getErrorMessage());
                    }
               }
//          };
     }
}
