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
@Table(name = UserEntity.TABLE_NAME)
public class UserEntity implements Serializable {
	private static final long serialVersionUID = 12345L;

	protected static final String TABLE_NAME = "USER_STORY";
	@Id
	private String userEmail;
	private String userName;
	private String userPassword;
	private String mobileNumber;
	private boolean darkModeEnabled;
}
