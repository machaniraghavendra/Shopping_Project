package com.shopping.query.command.repos;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopping.query.command.entites.OrdersEntity;

public interface OrderRepo extends JpaRepository<OrdersEntity, Integer>{

}
