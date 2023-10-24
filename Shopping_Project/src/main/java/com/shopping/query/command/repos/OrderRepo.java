package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopping.query.command.entites.OrdersEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo extends JpaRepository<OrdersEntity, Integer>{

}
