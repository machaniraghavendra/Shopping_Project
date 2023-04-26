package com.shopping.query.command.entites;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = UserEntity.tableName)
public class UserEntity implements Serializable {
	private static final long serialVersionUID = 12345L;

	 static final String tableName= "USER_STORY" ;
	@Id
	private String UserEmail;
	private String UserName;
	private String UserPassword;
	private String MobileNumber;
}
