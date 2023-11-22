package com.shopping.query.command.repos;

import com.shopping.query.command.entites.AdminsEntity;
import com.shopping.query.command.entites.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminsRepo extends JpaRepository<AdminsEntity, Integer> {

    AdminsEntity findByUser(UserEntity user);
}
