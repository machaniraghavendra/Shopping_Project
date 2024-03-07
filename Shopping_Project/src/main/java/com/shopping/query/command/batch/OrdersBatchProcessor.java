package com.shopping.query.command.batch;

import com.shopping.query.command.configuration.Constants;
import com.shopping.query.command.entites.OrdersEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class OrdersBatchProcessor implements ItemProcessor<OrdersEntity, OrdersEntity>, StepExecutionListener {

//    StepExecution stepExecution;

    @Override
    public OrdersEntity process(OrdersEntity item) throws Exception {
//        ExecutionContext executionContext = stepExecution.getExecutionContext();
//        executionContext.put("hello", "Raghu");
        if (!item.getOrderStatus().equals(Constants.STATUS_DELIVERED)) {
            return item;
        } else {
            return null;
        }
    }

//    @Override
//    public void beforeStep(StepExecution stepExecution){
//        this.stepExecution = stepExecution;
//    }
}
