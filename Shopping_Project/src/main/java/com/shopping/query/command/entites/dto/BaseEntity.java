package com.shopping.query.command.entites.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Date;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {

     @PrePersist
     public void prePersist() {
          if (createdOn == null) {
               createdOn = (new Date()).toInstant();
          }
          if (createdBy == null) {
               createdBy = "SYSTEM";
          }
          if (modifiedOn == null) {
               modifiedOn = Instant.now();
          }
          if (modifiedBy == null) {
               modifiedBy = "SYSTEM";
          }
     }

     @PreUpdate
     public void preUpdate() {
          modifiedOn = (new Date()).toInstant();
     }

     @Column(name = "CREATED_BY", nullable = false)
     private String createdBy;

     @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
     @Column(name = "CREATED_ON", columnDefinition = "timestamp default current_timestamp")
     private Instant createdOn;

     @Column(name = "MODIFIED_BY", nullable = false)
     private String modifiedBy;

     @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
     @Column(name = "MODIFIED_ON", columnDefinition = "timestamp on update current_timestamp default current_timestamp", nullable = false)
     private Instant modifiedOn;
}