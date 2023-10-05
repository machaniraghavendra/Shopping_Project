package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.BatchUpdateOfOrder;
import com.shopping.query.command.repos.BatchUpdateOfOrderRepo;
import com.shopping.query.command.service.BatchUpdateOfOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class BatchUpdateOfOrderServiceImpl implements BatchUpdateOfOrderService {

    @Autowired
    private BatchUpdateOfOrderRepo updateOfOrderRepo;

    @Override
    public BatchUpdateOfOrder save(BatchUpdateOfOrder updateOfOrder) {
            return updateOfOrderRepo.save(updateOfOrder);
    }

    @Override
    public BatchUpdateOfOrder update(BatchUpdateOfOrder updateOfOrder) {
        if (updateOfOrderRepo.existsById(updateOfOrder.getBatchRunID())){
            return updateOfOrderRepo.save(updateOfOrder);
        }
        return null;
    }

    @Override
    public int getCount() {
        return (int) updateOfOrderRepo.count();
    }
}
