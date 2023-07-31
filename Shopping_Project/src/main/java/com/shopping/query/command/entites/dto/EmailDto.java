package com.shopping.query.command.entites.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailDto {
	private String recipient;
	private String msgBody;
	private String subject;
	private String attachment;
}
