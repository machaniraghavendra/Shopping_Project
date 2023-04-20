package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.CartEntity;

@Repository
public interface CartRepo extends JpaRepository<CartEntity, Integer>{

}
