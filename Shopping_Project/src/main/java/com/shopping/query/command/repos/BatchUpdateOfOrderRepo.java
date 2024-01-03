package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.BatchUpdateOfOrder;

@Repository
public interface BatchUpdateOfOrderRepo extends JpaRepository<BatchUpdateOfOrder, Integer>{

    @Query(value = "SELECT * FROM UPDATEORDERSBATCH where BATCH_RUN_ID = (SELECT MAX(BATCH_RUN_ID) FROM UPDATEORDERSBATCH WHERE BATCH_NAME = 'orderupdatejob')", nativeQuery = true)
    BatchUpdateOfOrder getLastRunJobOfOrders();

}
