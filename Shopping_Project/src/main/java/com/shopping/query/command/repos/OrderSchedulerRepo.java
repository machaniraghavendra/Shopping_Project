package com.shopping.query.command.repos;

import com.shopping.query.command.entites.OrderSchedulerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderSchedulerRepo extends JpaRepository<OrderSchedulerEntity, Integer> {
     OrderSchedulerEntity findByUuid(UUID uuid);

     @Query(value = "SELECT * FROM ORDER_SCHEDULER os WHERE os.ORDER_DETAILS LIKE %:userId%", nativeQuery = true)
     List<OrderSchedulerEntity> getAllByUserUuid(@Param("userId") UUID userUuid);
}
