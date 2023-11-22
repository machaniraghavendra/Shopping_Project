package com.shopping.query.command.service;

import com.shopping.query.command.entites.AdminsEntity;
import com.shopping.query.command.entites.UserEntity;

import java.util.List;

public interface AdminService {

    AdminsEntity addAdmin(UserEntity user);

    List<AdminsEntity> getAllAdmins();
}
