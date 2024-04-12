package com.shopping.query.command.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shopping.query.command.entites.dto.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "ORDER_SCHEDULER")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderSchedulerEntity extends BaseEntity {

     @PrePersist
     @Override
     public void prePersist(){
          if (uuid==null){
               this.uuid=UUID.randomUUID();
          }
          super.prePersist();
     }

     public void preUpdate(){
          super.preUpdate();
     }

     @Id
     @GeneratedValue
     @JsonIgnore
     @Column(name = "ID")
     private int id;
     @Column(name = "UUID", nullable = false)
     private UUID uuid;
     @Column(name = "ORDER_DETAILS", nullable = false)
     @Convert(converter = OrderEntityToStringConverter.class)
     private OrdersEntity orderDetails;
     @Column(name = "JOB_COMPLETED", nullable = false)
     private Boolean jobCompleted;
     @Column(name = "SCHEDULED_ON", nullable = false)
     private LocalDateTime scheduledOn;
     @Column(name = "IS_DELETED", nullable = false)
     private Boolean isDeleted;
}
