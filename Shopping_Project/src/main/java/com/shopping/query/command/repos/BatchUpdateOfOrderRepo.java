package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.BatchUpdateOfOrder;

@Repository
public interface BatchUpdateOfOrderRepo extends JpaRepository<BatchUpdateOfOrder, Integer>{

    @Query(value = "SELECT * FROM UPDATEORDERSBATCH where BATCH_RUNID = (SELECT MAX(BATCH_RUNID) FROM UPDATEORDERSBATCH WHERE BATCHNAME = 'orderupdatejob')", nativeQuery = true)
    BatchUpdateOfOrder getLastRunJobOfOrders();

}
