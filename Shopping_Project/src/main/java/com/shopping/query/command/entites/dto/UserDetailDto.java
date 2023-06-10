package com.shopping.query.command.entites.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailDto {

	private String userEmail;
	private String userName;
	private String mobileNumber;
	private boolean darkModeEnabled;

}
