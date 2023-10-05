package com.shopping.query.command.batch;

import org.springframework.batch.core.ItemWriteListener;
import org.springframework.batch.item.Chunk;
import org.springframework.stereotype.Component;

import com.shopping.query.command.entites.OrdersEntity;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Data
public class WriterListener implements ItemWriteListener<OrdersEntity> {


    @Override
    public void beforeWrite(Chunk<? extends OrdersEntity> items){
        log.info("writing job has been started with size ");
    }

    @Override
    public void afterWrite(Chunk<? extends OrdersEntity> items) {
        log.info("Items writend in the table");
    }

}
