package com.shopping.query.command.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shopping.query.command.entites.UserEntity;

@Repository
public interface UserRepo extends  JpaRepository<UserEntity, String>{

}
