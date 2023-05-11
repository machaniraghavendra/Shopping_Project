package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopping.query.command.entites.AddressEntity;

public interface AddressRepo extends JpaRepository<AddressEntity, Integer>{

}
