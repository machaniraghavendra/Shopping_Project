package com.shopping.query.command.entites;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Table(name = "OTP_ENTITY")
public class OtpEntity {

    @PrePersist
    public void prePersist(){
        if(Objects.isNull(otpGeneratedOn)) otpGeneratedOn = new Date().toInstant();
    }

    @PreUpdate
    public void preUpdate(){
        if(Objects.isNull(otpGeneratedOn)) otpGeneratedOn = new Date().toInstant();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String userId;
    private Instant otpGeneratedOn;
    private String otp;
}
