package com.shopping.query.command.entites;

import com.shopping.query.command.entites.dto.BaseEntity;
import com.shopping.query.command.entites.enums.NotificationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "NOTIFICATION")
@Builder
public class Notification extends BaseEntity {

     @PrePersist
     @Override
     public void prePersist() {
          super.prePersist();
     }

     @PreUpdate
     @Override
     public void preUpdate() {
          super.preUpdate();
     }

     @Id
     @GeneratedValue
     private UUID uuid;
     @Column(name = "USER_EMAIL", nullable = false)
     @NotNull(message = "User email should not be null")
     private String userUuid;
     @Column(name = "NOTIFICATION_TYPE", nullable = false)
     @Enumerated(EnumType.STRING)
     private NotificationType notificationType;
     @NotNull(message = "Notification message should not be null")
     @Column(name = "MESSAGE", nullable = false)
     private String message;
     @Column(name = "LINK")
     private String link;
     @Column(name = "NOTIFICATION_VIEWED", nullable = false)
     private Boolean isNotificationViewed;
}
