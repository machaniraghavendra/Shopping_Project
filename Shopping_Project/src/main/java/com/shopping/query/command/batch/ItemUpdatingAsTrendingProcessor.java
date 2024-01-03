package com.shopping.query.command.batch;

import com.shopping.query.command.entites.ItemEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class ItemUpdatingAsTrendingProcessor implements ItemProcessor<ItemEntity, ItemEntity> {

     @Override
     public ItemEntity process(ItemEntity item) throws Exception {
          if (item.getTotalOrders()>10 && !item.isTrending()) return item;
          return null;
     }
}
