package com.shopping.query.command.batch;

import com.shopping.query.command.configuration.Constants;
import com.shopping.query.command.entites.OrdersEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class OrdersBatchProcessor implements ItemProcessor<OrdersEntity, OrdersEntity> {
    @Override
    public OrdersEntity process(OrdersEntity item) throws Exception {
        if (!item.getOrderStatus().equals(Constants.STATUS_DELIVERED)) {
            return item;
        } else {
            return null;
        }
    }
}
