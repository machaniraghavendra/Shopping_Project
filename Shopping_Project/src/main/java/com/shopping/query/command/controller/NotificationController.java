package com.shopping.query.command.controller;

import com.shopping.query.command.entites.Notification;
import com.shopping.query.command.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

     @Autowired
     private NotificationService notificationService;

     @PutMapping
     public ResponseEntity<Object> markNotificationAsViewed(@RequestParam("userId") UUID userId, @RequestParam("uuid") UUID uuid) {
          notificationService.markAsViewed(userId, uuid);
          return ResponseEntity.ok("Marked as viewed");
     }

     @GetMapping
     public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam("userId") UUID userId) {
          return ResponseEntity.ok(notificationService.getAllNotificationsOfUser(userId));
     }
}
