package com.shopping.query.command.repos;

import com.shopping.query.command.entites.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, UUID> {

     @Query(value = "SELECT * FROM NOTIFICATION WHERE USER_EMAIL =?1 AND NOTIFICATION_VIEWED = 0", nativeQuery = true)
     List<Notification> getAllByUserEmail(UUID userId);
}
