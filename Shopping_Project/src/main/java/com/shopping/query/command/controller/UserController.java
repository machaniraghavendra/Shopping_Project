package com.shopping.query.command.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopping.query.command.entites.UserEntity;
import com.shopping.query.command.entites.dto.UserDetailDto;
import com.shopping.query.command.exceptions.UserException;
import com.shopping.query.command.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/user")
@Tag(name = "User Api's", description = "Get's, delete and post operations will be done here")
public class UserController {

    @Autowired
    private UserService userServiceImpl;

    @PostMapping("/")
    public ResponseEntity<String> save(@RequestBody UserEntity userEntity) throws UserException {
        return ResponseEntity.ok(userServiceImpl.save(userEntity));
    }

    @PutMapping("/")
    public ResponseEntity<String> update(@RequestBody UserEntity userEntity) throws UserException {
        return ResponseEntity.ok(userServiceImpl.update(userEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") UUID userId) throws UserException {
        return ResponseEntity.ok(userServiceImpl.delete(userId));
    }

    @GetMapping("/{userEmail}")
    public ResponseEntity<UserDetailDto> find(@PathVariable("userEmail") String userEmail)
            throws UserException {
        return ResponseEntity.ok(userServiceImpl.find(userEmail));
    }

    @GetMapping("/userid/{userId}")
    public ResponseEntity<UserDetailDto> find(@PathVariable("userId") UUID userId) throws UserException {
        return ResponseEntity.ok(userServiceImpl.getUserWithId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserEntity>> findall() {
        return ResponseEntity.ok(userServiceImpl.findall());
    }

    @GetMapping("/{useremail}/{password}")
    public ResponseEntity<Boolean> check(@PathVariable("useremail") String userEmail,
                                         @PathVariable("password") String userPassword) throws UserException {
        return ResponseEntity.ok(userServiceImpl.check(userEmail, userPassword));
    }

    @GetMapping("/admin/userid")
    public ResponseEntity<Boolean> checkIsAdmin(@RequestParam("userId") UUID userId) throws UserException {
        return ResponseEntity.ok(userServiceImpl.checkIsAdmin(userId));
    }

    @PostMapping("/sendotp/{useremail}/{username}")
    public ResponseEntity<String> sendOtpToUserEmail(@PathVariable("useremail") @NotNull String userEmail, @PathVariable("username") @NotNull String userName) {
        return ResponseEntity.ok(userServiceImpl.sendOtpToUserEmail(userEmail, userName));
    }

    @PostMapping("/verifyotp/{useremail}/{otp}")
    public ResponseEntity<String> verifyOtpOfUser(@PathVariable("useremail") @NotNull String userEmail, @PathVariable("otp") @NotNull String otp) {
        return ResponseEntity.ok(userServiceImpl.verifyEmailOtpOfUser(userEmail, otp));
    }
}
