package com.shopping.query.command.entites.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailDto {

	private UUID userId;
	private String userEmail;
	private String userName;
	private String mobileNumber;
	private String profileImgUrl;
	private boolean isLoggedIn;
	private boolean admin;

}
