package com.shopping.query.command.entites;

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

}
