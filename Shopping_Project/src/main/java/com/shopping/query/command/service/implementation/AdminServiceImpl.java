package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.AdminsEntity;
import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.repos.AdminsRepo;
import com.shopping.query.command.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class AdminServiceImpl extends SecurityServiceImpl implements AdminService {

    @Autowired
    private AdminsRepo repo;

    @Override
    public AdminsEntity addAdmin(UserEntity user) {
        try {
            if (Objects.isNull(user)) throw new UserException("User data is null");
            var admin = AdminsEntity.builder().user(user).build();
            if (Objects.isNull(findByUserEmail(user))) {
                admin = repo.save(admin);
                return admin;
            }
        } catch (UserException e) {
            log.error(e.getMessage());
        }
        return null;
    }


    private AdminsEntity findByUserEmail(UserEntity user) {
        return repo.findByUser(user);
    }

    @Override
    public List<AdminsEntity> getAllAdmins() {
        return repo.findAll();
    }
}
