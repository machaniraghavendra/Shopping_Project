package com.shopping.query.command.service.implementation;

import com.shopping.query.command.entites.Notification;
import com.shopping.query.command.exceptions.NotificationException;
import com.shopping.query.command.repos.NotificationRepo;
import com.shopping.query.command.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

     @Autowired
     NotificationRepo notificationRepo;

     @Override
     public void sendNotification(Notification notification) {
          CompletableFuture.runAsync(() -> {
               try {
                    notificationRepo.save(notification);
                    log.info("Sent notification to user");
               } catch (Exception e) {
                    log.error(e.getMessage());
               }
          });
     }

     @Override
     public void markAsViewed(UUID userId, UUID uuid) {
          try {
               var notification = getNotificationByUuid(uuid);
               notification.setIsNotificationViewed(Boolean.TRUE);
               notificationRepo.save(notification);
          } catch (Exception e) {
               log.error(e.getMessage());
          }
     }

     private Notification getNotificationByUuid(UUID uuid) throws NotificationException {
          return notificationRepo.findById(uuid).orElseThrow(() -> new NotificationException("No notification is present with this id " + uuid));
     }

     @Override
     public List<Notification> getAllNotificationsOfUser(UUID userId) {
          return notificationRepo.getAllByUserEmail(userId);
     }
}
