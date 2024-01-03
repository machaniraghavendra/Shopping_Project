package com.shopping.query.command.service.implementation;

import com.shopping.query.command.configuration.Constants;
import com.shopping.query.command.entites.BatchUpdateOfOrder;
import com.shopping.query.command.repos.BatchUpdateOfOrderRepo;
import com.shopping.query.command.service.BatchUpdateOfOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
public class BatchUpdateOfOrderServiceImpl implements BatchUpdateOfOrderService {

     @Autowired
     private BatchUpdateOfOrderRepo updateOfOrderRepo;

     @Autowired
     private Constants constants;

     @Override
     public BatchUpdateOfOrder save(BatchUpdateOfOrder updateOfOrder) {
          return updateOfOrderRepo.save(updateOfOrder);
     }

     @Override
     public BatchUpdateOfOrder update(BatchUpdateOfOrder updateOfOrder) {
          if (updateOfOrderRepo.existsById(updateOfOrder.getBatchRunID())) {
               return updateOfOrderRepo.save(updateOfOrder);
          }
          return null;
     }

     @Override
     public int getCount() {
          return (int) updateOfOrderRepo.count();
     }

     @Override
     public boolean getLastRunnedTimeinHours() {
          try {
               var lastOrderBatch = updateOfOrderRepo.getLastRunJobOfOrders();
               if (Objects.nonNull(lastOrderBatch)) {
                    int diffHours = (int) (Math.abs(ChronoUnit.HOURS.between(lastOrderBatch.getEndDate().toInstant(), new Date().toInstant())));
                    log.info(diffHours + " hours back the orders batch runned");
                    if (diffHours >= Integer.parseInt(constants.BATCH_JOB_TIME)) {
                         return true;
                    }
               }else return true;
          } catch (Exception e) {
               log.error(e.getMessage());
          }
          return false;
     }
}
