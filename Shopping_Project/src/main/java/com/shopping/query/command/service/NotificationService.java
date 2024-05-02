package com.shopping.query.command.service;

import com.shopping.query.command.entites.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

     void sendNotification(Notification notification);

     void markAsViewed(UUID userId, UUID uuid);

     List<Notification> getAllNotificationsOfUser(UUID userId);
}
