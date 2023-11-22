package com.shopping.query.command.controller;

import com.shopping.query.command.entites.AdminsEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminsController {

    @Autowired
    private AdminService  adminService;

    @GetMapping
    public ResponseEntity<List<AdminsEntity>> getAllAdmins()
            throws UserException {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }
}
