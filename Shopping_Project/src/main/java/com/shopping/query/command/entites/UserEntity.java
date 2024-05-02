package com.shopping.query.command.entites;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = UserEntity.TABLE_NAME)
public class UserEntity implements Serializable {
     @Serial
     private static final long serialVersionUID = 12345L;

     protected static final String TABLE_NAME = "USER_STORY";
     @Id
     private String userEmail;
     @Column(columnDefinition = "Text")
     private UUID userId;
     private String userName;
     @NonNull
     private String userPassword;
     //@Pattern(regexp = "\\d{10}")
     @Column(unique = true)
     private String mobileNumber;
     @Lob
     private String profileImgUrl;
     private boolean isLoggedIn;
     private boolean admin;

//     @Override
//     public Collection<? extends GrantedAuthority> getAuthorities() {
//          return List.of(new SimpleGrantedAuthority(isAdmin() ? "ADMIN" : "USER"));
//     }
//
//     @Override
//     public String getPassword() {
//          return userPassword;
//     }
//
//     @Override
//     public String getUsername() {
//          return userEmail;
//     }
//
//     @Override
//     public boolean isAccountNonExpired() {
//          return true;
//     }
//
//     @Override
//     public boolean isAccountNonLocked() {
//          return true;
//     }
//
//     @Override
//     public boolean isCredentialsNonExpired() {
//          return true;
//     }
//
//     @Override
//     public boolean isEnabled() {
//          return true;
//     }
}
