package com.shopping.query.command.service;

import com.shopping.query.command.entites.BatchUpdateOfOrder;

public interface BatchUpdateOfOrderService {
    BatchUpdateOfOrder save(BatchUpdateOfOrder updateOfOrder);
    BatchUpdateOfOrder update(BatchUpdateOfOrder updateOfOrder);
    int getCount();
    boolean getLastRunnedTimeinHours();


}
