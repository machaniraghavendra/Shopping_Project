package com.shopping.query.command.entites;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
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
//	@Pattern(regexp = "\\d{10}")
	private String mobileNumber;
	@Column(length = 23000)
	private String profileImgUrl;
	private boolean isLoggedIn;
	private boolean admin;
}
