package com.shopping.query.command.configuration;

import com.shopping.query.command.exceptions.GlobalExceptionHandler;
import com.shopping.query.command.exceptions.ItemNotFoundException;
import com.shopping.query.command.exceptions.OrderNotFoundException;
import com.shopping.query.command.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Objects;

@Component
@Slf4j
@EnableAsync
public class OrdersUpdateScheduler {

    @Autowired
    private OrderService orderService;

    @Autowired
    private GlobalExceptionHandler globalExceptionHandler;

    @Scheduled(fixedDelayString = "${interval}")
    @Async
    public void updateOrders() throws InterruptedException {
        orderService.getAllOrders().forEach(order->{
            try {
                log.info("Updating order : {} at {}",order.getOrderUUIDId(), LocalDateTime.now());
                orderService.updateOrderStatus(order.getOrderUUIDId());
                log.info("Updated order : {} at {}",order.getOrderUUIDId(), LocalDateTime.now());
            } catch (OrderNotFoundException | ItemNotFoundException e) {
                if (e instanceof  OrderNotFoundException)
                    log.error( Objects.requireNonNull(globalExceptionHandler.orderNotFoundException((OrderNotFoundException) e).getBody()).getErrorMessage());
                if (e instanceof  ItemNotFoundException)
                    log.error( Objects.requireNonNull(globalExceptionHandler.itemNotFoundException((ItemNotFoundException) e).getBody()).getErrorMessage());
            }
        });
    }
}
