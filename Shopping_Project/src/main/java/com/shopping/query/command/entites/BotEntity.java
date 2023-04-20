package com.shopping.query.command.entites;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class BotEntity {
	private UUID id;
	private String userMessage;
	private String botMessage;
	private String userMessagedAt;
	private String botReturnedAt;
	private UserEntity userDetails;

}
