package com.shopping.query.command.batch;

import com.shopping.query.command.entites.ItemEntity;
import com.shopping.query.command.service.ItemService;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ItemBatchProcessor implements ItemProcessor<ItemEntity, ItemEntity> {

    @Autowired
    private ItemService itemService;

    @Override
    public ItemEntity process(ItemEntity item) throws Exception {
        if (!itemService.existsItemWithId(item.getItemId())) {
            return item;
        } else {
            return null;
        }
    }
}
